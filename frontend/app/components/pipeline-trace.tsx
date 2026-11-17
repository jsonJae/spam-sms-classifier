"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { ClockIcon, RadarIcon, RefreshCwIcon, ShieldCheck } from "./icons";
import type { Prediction } from "./result-card";
import { PRESET_EXAMPLES } from "./scanner-form";
import {
  decisionScore,
  PredictionError,
  requestPrediction,
  spamProbability,
} from "../lib/predict";
import { tokenize, type TraceToken } from "../lib/stop-words";

export type LastScan = { text: string; prediction: Prediction };

const LAST_SCAN = "__last-scan__";
const MAX_TOKENS = 40;

type Step = 0 | 1 | 2 | 3 | 4;

type Trace = {
  text: string;
  tokens: TraceToken[];
  prediction: Prediction | null;
  error: string | null;
};

const STAGES = [
  {
    title: "Message in",
    what: "Your text, trimmed of surrounding whitespace. It stays in memory only.",
    spec: "payload.text.strip()",
  },
  {
    title: "TF-IDF",
    what: "Lowercased and split into words. English stop words are dropped; the rest are weighed by how distinctive they are.",
    spec: 'TfidfVectorizer(stop_words="english", max_features=5000)',
  },
  {
    title: "Logistic regression",
    what: "Each term pushes a score toward spam or ham. The sigmoid turns that score into a probability.",
    spec: 'LogisticRegression(class_weight="balanced", max_iter=1000)',
  },
  {
    title: "Verdict",
    what: "The likelier class becomes the label. Under 60% confidence is flagged as borderline.",
    spec: "predict_proba → label, confidence",
  },
];

const SPECS = [
  {
    icon: ShieldCheck,
    title: "Zero persistence",
    body: "Message payloads are processed in memory and discarded immediately. No logs, databases, or cookies track your scans.",
  },
  {
    icon: RadarIcon,
    title: "Scikit-Learn + FastAPI",
    body: "Trained on real-world SMS corpora. TF-IDF tokenization generates calibrated probabilistic verdicts.",
  },
  {
    icon: ClockIcon,
    title: "Sub-20ms evaluation",
    body: "Built for quick decisions before you answer phone prompts, verify accounts, or tap unknown links.",
  },
];

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function PipelineTrace({ lastScan }: { lastScan: LastScan | null }) {
  const [selected, setSelected] = useState(PRESET_EXAMPLES[0].label);
  const [trace, setTrace] = useState<Trace | null>(null);
  const [step, setStep] = useState<Step>(0);
  const [runKey, setRunKey] = useState(0);

  const frameRef = useRef<HTMLDivElement>(null);
  const runIdRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);
  const startedRef = useRef(false);

  const activeKey = selected === LAST_SCAN && !lastScan ? PRESET_EXAMPLES[0].label : selected;

  const runTrace = useCallback(async (text: string, known?: Prediction) => {
    const runId = ++runIdRef.current;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const reduced = prefersReducedMotion();
    const wait = (ms: number) =>
      new Promise<void>((resolve) => window.setTimeout(resolve, reduced ? 0 : ms));
    const stale = () => runId !== runIdRef.current;

    const tokens = tokenize(text);
    startedRef.current = true;
    setRunKey(runId);
    setTrace({ text, tokens, prediction: null, error: null });
    setStep(1);

    const pending = known ? Promise.resolve(known) : requestPrediction(text, controller.signal);
    pending.catch(() => {});

    await wait(520);
    if (stale()) return;
    setStep(2);

    const shown = Math.min(tokens.length, MAX_TOKENS);
    await wait(Math.min(shown * 26, 700) + 700);
    if (stale()) return;
    setStep(3);

    try {
      const [prediction] = await Promise.all([pending, wait(450)]);
      if (stale()) return;
      setTrace((current) => (current ? { ...current, prediction } : current));
    } catch (err) {
      if (stale() || controller.signal.aborted) return;
      setTrace((current) =>
        current
          ? {
              ...current,
              error:
                err instanceof PredictionError && err.status < 500
                  ? err.message
                  : "The inference service is unreachable.",
            }
          : current,
      );
      return;
    }

    await wait(1100);
    if (stale()) return;
    setStep(4);
  }, []);

  const runSelected = useCallback(
    (key: string) => {
      if (key === LAST_SCAN && lastScan) {
        runTrace(lastScan.text, lastScan.prediction);
        return;
      }
      const preset = PRESET_EXAMPLES.find((item) => item.label === key) ?? PRESET_EXAMPLES[0];
      runTrace(preset.text);
    },
    [lastScan, runTrace],
  );

  useEffect(() => {
    const element = frameRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting) && !startedRef.current) {
          observer.disconnect();
          runTrace(PRESET_EXAMPLES[0].text);
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [runTrace]);

  useEffect(() => () => abortRef.current?.abort(), []);

  function choose(key: string) {
    setSelected(key);
    runSelected(key);
  }

  const prediction = trace?.prediction ?? null;
  const error = trace?.error ?? null;
  const pSpam = prediction ? spamProbability(prediction) : null;
  const z = pSpam === null ? null : decisionScore(pSpam);
  const progress = error ? 3 / 4 : step / 4;

  function stageStatus(index: number) {
    const stage = index + 1;
    if (error && stage >= 3) return stage === 3 ? "error" : "pending";
    if (step > stage || (step === 4 && stage === 4)) return "done";
    if (step === stage) return "active";
    return "pending";
  }

  const announcement = error
    ? `Trace stopped: ${error}`
    : step === 4 && prediction
      ? `Trace complete: ${prediction.label}, ${Math.round(prediction.confidence * 100)}% confidence.`
      : "";

  const chips = [
    ...PRESET_EXAMPLES.map((item) => ({ key: item.label, label: item.label })),
    ...(lastScan ? [{ key: LAST_SCAN, label: "Your last scan" }] : []),
  ];

  return (
    <div
      ref={frameRef}
      className="overflow-hidden rounded-xl border-2 border-ink bg-card shadow-[8px_8px_0_0_#121410]"
    >
      {/* Control bar */}
      <div className="grid grid-cols-[1fr_auto] items-center gap-3 border-b-2 border-ink bg-paper px-4 py-3.5 sm:px-5 lg:flex">
        <span id="trace-samples" className="shrink-0 text-sm font-bold text-ink">
          Trace a message
        </span>
        <div
          role="group"
          aria-labelledby="trace-samples"
          className="col-span-2 flex flex-wrap gap-2 lg:col-span-1"
        >
          {chips.map((chip) => {
            const isActive = activeKey === chip.key;
            return (
              <button
                key={chip.key}
                type="button"
                aria-pressed={isActive}
                onClick={() => choose(chip.key)}
                className={`min-h-9 rounded-md border-2 px-3 text-xs font-bold transition-[background-color,border-color,box-shadow,transform] duration-200 active:translate-x-px active:translate-y-px ${
                  isActive
                    ? "border-ink bg-primary text-ink shadow-[2px_2px_0_0_#121410]"
                    : "border-ink/20 bg-card text-ink/75 hover:border-ink hover:text-ink"
                } ${chip.key === LAST_SCAN ? "border-dashed" : ""}`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => runSelected(activeKey)}
          className="col-start-2 row-start-1 inline-flex min-h-9 items-center gap-2 rounded-md border-2 border-ink bg-card px-3 text-xs font-bold text-ink shadow-[2px_2px_0_0_#121410] transition-[transform,box-shadow] duration-200 hover:shadow-[3px_3px_0_0_#121410] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none lg:ml-auto"
        >
          <RefreshCwIcon className="size-3.5" />
          Replay
        </button>
      </div>

      {/* Progress rail */}
      <div className="h-1 bg-ink/10" aria-hidden="true">
        <div
          className={`h-full origin-left transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            error ? "bg-danger" : "bg-primary"
          }`}
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>

      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>

      {/* Stages */}
      <ol className="grid lg:grid-cols-4 lg:grid-rows-[auto_auto_minmax(14rem,1fr)_auto]">
        {STAGES.map((stage, index) => {
          const status = stageStatus(index);
          const reached = status !== "pending";

          return (
            <li
              key={stage.title}
              data-status={status}
              className={`relative flex flex-col transition-colors duration-500 lg:row-span-4 lg:grid lg:grid-rows-subgrid ${
                index > 0 ? "border-t-2 border-ink lg:border-t-0 lg:border-l-2" : ""
              } ${status === "active" ? "bg-primary/[0.05]" : ""}`}
            >
              {index > 0 && (
                <span
                  aria-hidden="true"
                  className={`absolute -top-[13px] left-5 z-10 grid size-6 place-items-center rounded-full border-2 border-ink transition-colors duration-300 lg:top-[22px] lg:-left-[13px] ${
                    reached ? "bg-primary text-ink" : "bg-card text-ink/40"
                  }`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-3 rotate-90 lg:rotate-0"
                  >
                    <path d="m9 6 6 6-6 6" />
                  </svg>
                </span>
              )}

              {/* Row 1: header */}
              <div className="flex items-center gap-3 px-5 pt-5 pb-2">
                <span
                  className={`grid size-7 shrink-0 place-items-center rounded-sm border-2 font-mono text-[11px] font-bold tabular-nums transition-colors duration-300 ${
                    status === "done"
                      ? "border-ink bg-ink text-paper"
                      : status === "active"
                        ? "border-ink bg-primary text-ink"
                        : status === "error"
                          ? "border-danger bg-danger-bg text-danger"
                          : "border-ink/20 bg-card text-ink/40"
                  }`}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-lg font-bold tracking-tight text-ink">
                  {stage.title}
                </h3>
              </div>

              {/* Row 2: what it does */}
              <p className="px-5 text-xs leading-relaxed text-muted-foreground sm:text-[13px]">
                {stage.what}
              </p>

              {/* Row 3: live output */}
              <div className="px-5 py-4">
                {index === 0 && <InputStage trace={trace} reached={reached} runKey={runKey} />}
                {index === 1 && <TokenStage trace={trace} reached={reached} runKey={runKey} />}
                {index === 2 && (
                  <ScoreStage
                    reached={reached}
                    scoring={step === 3 && !prediction && !error}
                    z={step >= 3 ? z : null}
                    pSpam={pSpam}
                    error={error}
                  />
                )}
                {index === 3 && (
                  <VerdictStage
                    prediction={step === 4 ? prediction : null}
                    blocked={Boolean(error)}
                    runKey={runKey}
                  />
                )}
              </div>

              {/* Row 4: exact configuration */}
              <div className="px-5 pb-5">
                <code className="block rounded-md border border-ink/15 bg-paper px-2.5 py-2 font-mono text-[11px] leading-snug [overflow-wrap:anywhere] text-ink/75">
                  {stage.spec}
                </code>
              </div>
            </li>
          );
        })}
      </ol>

      {/* System spec rail */}
      <dl
        id="docs"
        className="grid scroll-mt-28 border-t-2 border-ink bg-ink text-paper md:grid-cols-3"
      >
        {SPECS.map(({ icon: Icon, title, body }, index) => (
          <div
            key={title}
            className={`flex gap-4 px-5 py-5 sm:px-6 sm:py-6 ${
              index > 0 ? "border-t border-paper/15 md:border-t-0 md:border-l" : ""
            }`}
          >
            <span
              className={`grid size-9 shrink-0 place-items-center rounded-md border-2 ${
                index === 0
                  ? "border-primary bg-primary text-ink"
                  : "border-paper/20 text-primary"
              }`}
            >
              <Icon className="size-[18px]" />
            </span>
            <div>
              <dt className="font-display text-base font-bold tracking-tight">{title}</dt>
              <dd className="mt-1 text-[13px] leading-relaxed text-paper/65">{body}</dd>
            </div>
          </div>
        ))}
      </dl>
    </div>
  );
}

function Placeholder({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2" aria-hidden="true">
      {Array.from({ length: lines }, (_, i) => (
        <div
          key={i}
          className="h-2.5 rounded-full bg-ink/[0.07]"
          style={{ width: `${92 - i * 17}%` }}
        />
      ))}
    </div>
  );
}

function InputStage({
  trace,
  reached,
  runKey,
}: {
  trace: Trace | null;
  reached: boolean;
  runKey: number;
}) {
  if (!trace || !reached) return <Placeholder lines={4} />;

  return (
    <div key={runKey} className="trace-in">
      <blockquote className="line-clamp-6 rounded-lg border-2 border-ink/10 bg-paper px-3 py-2.5 text-[13px] leading-relaxed text-ink [overflow-wrap:anywhere]">
        {trace.text}
      </blockquote>
      <p className="mt-3 font-mono text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase tabular-nums">
        {trace.text.length.toLocaleString()} / 5,000 chars
      </p>
    </div>
  );
}

function TokenStage({
  trace,
  reached,
  runKey,
}: {
  trace: Trace | null;
  reached: boolean;
  runKey: number;
}) {
  if (!trace || !reached) return <Placeholder lines={3} />;

  const shown = trace.tokens.slice(0, MAX_TOKENS);
  const hidden = trace.tokens.length - shown.length;
  const stops = trace.tokens.filter((token) => token.stop).length;
  const kept = trace.tokens.length - stops;

  return (
    <div key={runKey}>
      <ul className="flex flex-wrap gap-1" aria-label="Tokens">
        {shown.map((token, i) => (
          <li
            key={`${token.text}-${i}`}
            data-stop={token.stop}
            style={{ "--i": i } as CSSProperties}
            className={`trace-token rounded-sm px-1.5 py-0.5 font-mono text-[11px] leading-tight ${
              token.stop
                ? "text-ink"
                : "border border-ink bg-paper font-semibold text-ink"
            }`}
          >
            {token.text}
            {token.stop && <span className="sr-only"> (stop word, dropped)</span>}
          </li>
        ))}
        {hidden > 0 && (
          <li className="px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">
            +{hidden} more
          </li>
        )}
      </ul>
      <p className="trace-in mt-3 font-mono text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase tabular-nums [animation-delay:500ms]">
        {kept} kept · {stops} dropped
      </p>
    </div>
  );
}

const PLOT = { left: 30, right: 250, top: 12, bottom: 132, zMax: 8 };

function sigmoid(value: number) {
  return 1 / (1 + Math.exp(-value));
}

function px(value: number) {
  const clamped = Math.max(-PLOT.zMax, Math.min(PLOT.zMax, value));
  return PLOT.left + ((clamped + PLOT.zMax) / (2 * PLOT.zMax)) * (PLOT.right - PLOT.left);
}

function py(p: number) {
  return PLOT.bottom - p * (PLOT.bottom - PLOT.top);
}

function curvePath(from: number, to: number) {
  const steps = Math.max(2, Math.ceil(Math.abs(to - from) * 6));
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const value = from + ((to - from) * i) / steps;
    d += `${i === 0 ? "M" : "L"}${px(value).toFixed(2)} ${py(sigmoid(value)).toFixed(2)}`;
  }
  return d;
}

const FULL_CURVE = curvePath(-PLOT.zMax, PLOT.zMax);

function ScoreStage({
  reached,
  scoring,
  z,
  pSpam,
  error,
}: {
  reached: boolean;
  scoring: boolean;
  z: number | null;
  pSpam: number | null;
  error: string | null;
}) {
  const trailRef = useRef<SVGPathElement>(null);
  const dotRef = useRef<SVGGElement>(null);
  const guideRef = useRef<SVGPathElement>(null);
  const zTextRef = useRef<HTMLSpanElement>(null);
  const pTextRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (z === null) return;

    const apply = (value: number, final: boolean) => {
      const clamped = Math.max(-PLOT.zMax, Math.min(PLOT.zMax, value));
      const x = px(clamped);
      const y = py(sigmoid(clamped));
      trailRef.current?.setAttribute("d", curvePath(0, clamped));
      dotRef.current?.setAttribute("transform", `translate(${x.toFixed(2)} ${y.toFixed(2)})`);
      guideRef.current?.setAttribute(
        "d",
        `M${x.toFixed(2)} ${PLOT.bottom} V${y.toFixed(2)} H${PLOT.left}`,
      );
      if (zTextRef.current) {
        zTextRef.current.textContent = `${value >= 0 ? "+" : "−"}${Math.abs(value).toFixed(2)}`;
      }
      if (pTextRef.current) {
        const p = final && pSpam !== null ? pSpam : sigmoid(value);
        pTextRef.current.textContent = p.toFixed(3);
      }
    };

    if (prefersReducedMotion()) {
      apply(z, true);
      return;
    }

    let frame = 0;
    const start = performance.now();
    const duration = 1000;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      apply(z * eased, t === 1);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [z, pSpam]);

  const showDot = scoring || z !== null;
  const midX = px(0);
  const midY = py(0.5);

  return (
    <div className={reached ? "" : "opacity-45"}>
      <svg
        viewBox="0 0 260 160"
        className="w-full overflow-visible"
        role="img"
        aria-label={
          z !== null && pSpam !== null
            ? `Sigmoid curve. Decision score ${z.toFixed(2)}, probability of spam ${pSpam.toFixed(3)}.`
            : "Sigmoid curve mapping the decision score to a spam probability."
        }
      >
        {/* Borderline band: confidence under 60% */}
        <rect
          x={PLOT.left}
          y={py(0.6)}
          width={PLOT.right - PLOT.left}
          height={py(0.4) - py(0.6)}
          className="fill-warning-bg"
        />
        <text
          x={PLOT.right - 3}
          y={py(0.6) + 9}
          textAnchor="end"
          className="fill-warning font-mono text-[7.5px] font-semibold tracking-[0.12em] uppercase"
        >
          borderline
        </text>

        {/* Axes */}
        <path
          d={`M${PLOT.left} ${PLOT.top} V${PLOT.bottom} H${PLOT.right}`}
          className="fill-none stroke-ink/30"
          strokeWidth="1"
        />
        <path
          d={`M${midX} ${PLOT.top} V${PLOT.bottom}`}
          className="fill-none stroke-ink/15"
          strokeDasharray="2 3"
        />
        {[0, 0.5, 1].map((tick) => (
          <text
            key={tick}
            x={PLOT.left - 6}
            y={py(tick) + 3}
            textAnchor="end"
            className="fill-muted-foreground font-mono text-[8px] tabular-nums"
          >
            {tick === 0.5 ? ".5" : tick}
          </text>
        ))}
        <text
          x={PLOT.left}
          y={PLOT.bottom + 16}
          className="fill-success font-mono text-[8px] font-semibold tracking-[0.1em] uppercase"
        >
          ← ham
        </text>
        <text
          x={midX}
          y={PLOT.bottom + 16}
          textAnchor="middle"
          className="fill-muted-foreground font-mono text-[8px]"
        >
          score z
        </text>
        <text
          x={PLOT.right}
          y={PLOT.bottom + 16}
          textAnchor="end"
          className="fill-danger font-mono text-[8px] font-semibold tracking-[0.1em] uppercase"
        >
          spam →
        </text>

        {/* Curve and live trail */}
        <path d={FULL_CURVE} className="fill-none stroke-ink/25" strokeWidth="2" />
        {z !== null && (
          <>
            <path
              ref={guideRef}
              className="fill-none stroke-primary/70"
              strokeWidth="1"
              strokeDasharray="2 2.5"
            />
            <path
              ref={trailRef}
              className="fill-none stroke-primary"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </>
        )}

        {showDot && (
          <g ref={dotRef} transform={`translate(${midX} ${midY})`}>
            {scoring && <circle r="9" className="trace-pulse fill-primary/30" />}
            <circle r="5.5" className="fill-primary stroke-ink" strokeWidth="2" />
          </g>
        )}
      </svg>

      <div className="mt-2 flex items-baseline justify-between gap-3 font-mono text-[11px] tabular-nums">
        {error ? (
          <p className="font-sans text-xs leading-relaxed text-danger" role="status">
            {error} The tokens above come from your browser. Start the backend to see the live score.
          </p>
        ) : scoring ? (
          <span className="text-muted-foreground">Scoring with the live model…</span>
        ) : z !== null ? (
          <>
            <span className="text-ink/70">
              z <span ref={zTextRef} className="font-semibold text-ink">+0.00</span>
            </span>
            <span className="text-ink/70">
              P(spam) <span ref={pTextRef} className="font-semibold text-ink">0.500</span>
            </span>
          </>
        ) : (
          <span className="text-muted-foreground/70">Waiting for tokens</span>
        )}
      </div>
    </div>
  );
}

const VERDICT_TONES = {
  spam: { stamp: "border-danger text-danger bg-danger-bg", meter: "bg-danger", text: "text-danger" },
  safe: { stamp: "border-success text-success bg-success-bg", meter: "bg-success", text: "text-success" },
  uncertain: { stamp: "border-warning text-warning bg-warning-bg", meter: "bg-warning", text: "text-warning" },
} as const;

function VerdictStage({
  prediction,
  blocked,
  runKey,
}: {
  prediction: Prediction | null;
  blocked: boolean;
  runKey: number;
}) {
  if (blocked) {
    return (
      <p className="text-xs leading-relaxed text-muted-foreground">
        No verdict without the live score.
      </p>
    );
  }

  if (!prediction) return <Placeholder lines={2} />;

  const ratio = Math.min(1, Math.max(0, prediction.confidence));
  const pct = Math.round(ratio * 100);
  const tone = pct < 60 ? "uncertain" : prediction.is_spam ? "spam" : "safe";
  const styles = VERDICT_TONES[tone];

  return (
    <div key={runKey}>
      <span
        className={`trace-stamp inline-block rounded-md border-[3px] px-3 py-0.5 font-display text-3xl font-bold tracking-tight uppercase ${styles.stamp}`}
      >
        {prediction.label}
      </span>

      <p className="trace-in mt-5 font-display text-5xl leading-none font-bold tracking-[-0.04em] text-ink tabular-nums [animation-delay:180ms]">
        {pct}
        <span className="text-2xl">%</span>
      </p>
      <p className="trace-in mt-1.5 text-xs text-muted-foreground [animation-delay:220ms]">
        confidence in “{prediction.label}”
      </p>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-ink/10" aria-hidden="true">
        <div
          className={`h-full origin-left animate-meter-fill ${styles.meter}`}
          style={{ "--confidence": ratio } as CSSProperties}
        />
      </div>

      {tone === "uncertain" && (
        <p className={`trace-in mt-3 text-xs font-semibold ${styles.text} [animation-delay:320ms]`}>
          Borderline: verify the sender before acting.
        </p>
      )}
    </div>
  );
}
