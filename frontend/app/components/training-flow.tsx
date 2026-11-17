"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

// Counts from README.md / sms-message-classifier.ipynb.
const HAM = 4825;
const SPAM = 1023;
const TOTAL = HAM + SPAM; // 5,848 after cleaning
const TRAIN = 4678;
const TEST = 1170;

// Chart geometry in viewBox units. The SVG stretches horizontally.
const W = 1000;
const H = 300;
const GAP = 22;
const SPAN = H - 2 * 14 - GAP; // vertical space shared by stacked bars
const S = SPAN / TOTAL;

const hamH = HAM * S;
const spamH = SPAM * S;
const trainH = TRAIN * S;
const testH = TEST * S;
const top = (H - (SPAN + GAP)) / 2;

// Ribbons meet at the column edges and centre; the node bars are drawn as
// fixed-width elements on top so they keep their width when the SVG stretches.
const SRC_X = 0;
const MID_X0 = W / 2;
const MID_X1 = W / 2;
const DST_X = W;

const hamY = top;
const spamY = top + hamH + GAP;
const midY = (H - SPAN) / 2;
const trainY = top;
const testY = top + trainH + GAP;

// Stratified split keeps the class ratio in both halves.
const hamShare = HAM / TOTAL;
const trainHam = trainH * hamShare;
const testHam = testH * hamShare;

type Cls = "ham" | "spam";

function ribbon(x1: number, a1: number, a2: number, x2: number, b1: number, b2: number) {
  const xm = (x1 + x2) / 2;
  return `M${x1} ${a1} C${xm} ${a1} ${xm} ${b1} ${x2} ${b1} L${x2} ${b2} C${xm} ${b2} ${xm} ${a2} ${x1} ${a2} Z`;
}

const RIBBONS: { cls: Cls; d: string }[] = [
  // Sources into the combined set
  { cls: "ham", d: ribbon(SRC_X, hamY, hamY + hamH, MID_X0, midY, midY + hamH) },
  { cls: "spam", d: ribbon(SRC_X, spamY, spamY + spamH, MID_X0, midY + hamH, midY + SPAN) },
  // Combined set into train / test, class by class
  { cls: "ham", d: ribbon(MID_X1, midY, midY + trainHam, DST_X, trainY, trainY + trainHam) },
  {
    cls: "spam",
    d: ribbon(MID_X1, midY + trainHam, midY + trainH, DST_X, trainY + trainHam, trainY + trainH),
  },
  {
    cls: "ham",
    d: ribbon(MID_X1, midY + trainH, midY + trainH + testHam, DST_X, testY, testY + testHam),
  },
  {
    cls: "spam",
    d: ribbon(MID_X1, midY + trainH + testHam, midY + SPAN, DST_X, testY + testHam, testY + testH),
  },
];

const pct = (y: number) => `${(y / H) * 100}%`;

export function TrainingFlow() {
  const ref = useRef<HTMLDivElement>(null);
  const [drawn, setDrawn] = useState(false);
  const [focus, setFocus] = useState<Cls | null>(null);
  const [pinned, setPinned] = useState<Cls | null>(null);
  const active = focus ?? pinned;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setDrawn(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  function ribbonOpacity(cls: Cls) {
    if (!active) return 0.32;
    return active === cls ? 0.62 : 0.07;
  }

  function sourceProps(cls: Cls) {
    return {
      type: "button" as const,
      "aria-pressed": pinned === cls,
      onMouseEnter: () => setFocus(cls),
      onMouseLeave: () => setFocus(null),
      onFocus: () => setFocus(cls),
      onBlur: () => setFocus(null),
      onClick: () => setPinned((current) => (current === cls ? null : cls)),
    };
  }

  return (
    <div className="mt-20 sm:mt-24">
      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-14">
        <h3 className="font-display text-[clamp(26px,3.6vw,36px)] leading-tight font-bold tracking-[-0.03em] text-ink">
          What it learned from
        </h3>
        <p className="max-w-[60ch] text-sm leading-relaxed text-muted-foreground text-pretty">
          Each source contributes only one class, so the model can pick up
          language and source cues as well as spam cues. Read 0.99 as a result
          on this split, not a promise about every text you receive.
        </p>
      </div>

      <div
        ref={ref}
        data-drawn={drawn}
        className="flow mt-8 overflow-hidden rounded-xl border-2 border-ink bg-card shadow-[5px_5px_0_0_#121410]"
      >
        <div className="grid grid-cols-[4.75rem_minmax(0,1fr)_4.5rem] gap-2.5 px-4 pt-6 pb-5 sm:grid-cols-[9.5rem_minmax(0,1fr)_7rem] sm:gap-5 sm:px-6 sm:pt-8">
          {/* Column captions */}
          <p className="text-[11px] font-semibold text-muted-foreground">Sources</p>
          <p className="text-center text-[11px] font-semibold text-muted-foreground">
            Combined
          </p>
          <p className="text-right text-[11px] font-semibold text-muted-foreground">
            <span className="sm:hidden">Split</span>
            <span className="hidden sm:inline">Stratified split</span>
          </p>

          {/* Source labels */}
          <div className="relative h-60 sm:h-72">
            {(
              [
                { cls: "ham", y: hamY + hamH / 2, value: HAM, label: "Ham", source: "UCI SMS Spam Collection" },
                { cls: "spam", y: spamY + spamH / 2, value: SPAM, label: "Spam", source: "Philippine spam SMS" },
              ] as const
            ).map((item, i) => (
              <button
                key={item.cls}
                {...sourceProps(item.cls)}
                style={{ top: pct(item.y), "--d": `${300 + i * 120}ms` } as CSSProperties}
                className="flow-label absolute right-0 left-0 -translate-y-1/2 rounded-md py-1 pr-1 text-left transition-colors hover:bg-paper aria-pressed:bg-paper"
              >
                <span className="flex items-center gap-1.5">
                  <span
                    aria-hidden="true"
                    className={`size-2 shrink-0 rounded-full ${item.cls === "ham" ? "bg-success" : "bg-danger"}`}
                  />
                  <span className="font-display text-lg leading-none font-bold tracking-tight text-ink tabular-nums sm:text-xl">
                    {item.value.toLocaleString()}
                  </span>
                </span>
                <span className="mt-1 block text-[11px] leading-tight text-muted-foreground">
                  <span className="font-semibold text-ink">{item.label}</span>
                  <span className="hidden sm:inline"> · {item.source}</span>
                </span>
              </button>
            ))}
          </div>

          {/* Ribbons */}
          <div className="relative h-60 sm:h-72">
            <svg
              viewBox={`0 0 ${W} ${H}`}
              preserveAspectRatio="none"
              className="absolute inset-0 size-full"
              role="img"
              aria-label={`${HAM.toLocaleString()} ham and ${SPAM.toLocaleString()} spam messages combine into ${TOTAL.toLocaleString()}, then split into ${TRAIN.toLocaleString()} training and ${TEST.toLocaleString()} test messages.`}
            >
              <g className="flow-ribbons">
                {RIBBONS.map((r, i) => (
                  <path
                    key={i}
                    d={r.d}
                    className={`transition-opacity duration-300 ${r.cls === "ham" ? "fill-success" : "fill-danger"}`}
                    style={{ opacity: ribbonOpacity(r.cls) }}
                  />
                ))}
              </g>
            </svg>

            {/* Nodes */}
            {(
              [
                { side: "left-0", y: hamY, h: hamH, cls: "bg-success" },
                { side: "left-0", y: spamY, h: spamH, cls: "bg-danger" },
                { side: "left-1/2 -translate-x-1/2", y: midY, h: SPAN, cls: "bg-ink" },
                { side: "right-0", y: trainY, h: trainHam, cls: "bg-success" },
                { side: "right-0", y: trainY + trainHam, h: trainH - trainHam, cls: "bg-danger" },
                { side: "right-0", y: testY, h: testHam, cls: "bg-success" },
                { side: "right-0", y: testY + testHam, h: testH - testHam, cls: "bg-danger" },
              ] as const
            ).map((node, i) => (
              <span
                key={i}
                aria-hidden="true"
                className={`absolute w-2 sm:w-2.5 ${node.side} ${node.cls}`}
                style={{ top: pct(node.y), height: pct(node.h) }}
              />
            ))}

            <div
              className="flow-label absolute left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md border-2 border-ink bg-ink px-2.5 py-1.5 text-center text-paper shadow-[3px_3px_0_0_rgba(18,20,16,0.25)]"
              style={{ top: pct(midY + SPAN / 2), "--d": "760ms" } as CSSProperties}
            >
              <span className="block font-display text-lg leading-none font-bold tracking-tight tabular-nums sm:text-xl">
                {TOTAL.toLocaleString()}
              </span>
              <span className="mt-1 block text-[10px] leading-none text-paper/65">messages</span>
            </div>
          </div>

          {/* Split labels */}
          <div className="relative h-60 sm:h-72">
            {(
              [
                { y: trainY + trainH / 2, value: TRAIN, label: "Train", note: "80%" },
                { y: testY + testH / 2, value: TEST, label: "Test", note: "20%" },
              ] as const
            ).map((item, i) => (
              <div
                key={item.label}
                style={{ top: pct(item.y), "--d": `${1100 + i * 120}ms` } as CSSProperties}
                className="flow-label absolute right-0 left-0 -translate-y-1/2 text-right"
              >
                <span className="block font-display text-lg leading-none font-bold tracking-tight text-ink tabular-nums sm:text-xl">
                  {item.value.toLocaleString()}
                </span>
                <span className="mt-1 block text-[11px] leading-tight text-muted-foreground">
                  <span className="font-semibold text-ink">{item.label}</span> · {item.note}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Results ledger */}
        <dl className="grid grid-cols-2 border-t-2 border-ink bg-paper sm:grid-cols-3">
          <div className="px-5 py-4 sm:px-6">
            <dt className="text-xs text-muted-foreground">Test accuracy</dt>
            <dd className="mt-1 font-display text-2xl leading-none sm:text-3xl font-bold tracking-tight text-primary-hover tabular-nums">
              0.99
            </dd>
          </div>
          <div className="border-l border-ink/15 px-5 py-4 sm:px-6">
            <dt className="text-xs text-muted-foreground">F1 score, ham / spam</dt>
            <dd className="mt-1 font-display text-2xl leading-none sm:text-3xl font-bold tracking-tight text-ink tabular-nums">
              1.00 <span className="text-ink/30">/</span> 0.99
            </dd>
          </div>
          <div className="col-span-2 border-t border-ink/15 px-5 py-4 sm:col-span-1 sm:border-t-0 sm:border-l sm:px-6">
            <dt className="text-xs text-muted-foreground">Split</dt>
            <dd className="mt-1.5 text-sm leading-snug font-semibold text-ink">
              Stratified 80/20,{" "}
              <code className="font-mono text-[12px] font-normal text-ink/75">random_state=42</code>
            </dd>
          </div>
        </dl>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Hover or tap a source to follow its messages through the split.
      </p>
    </div>
  );
}
