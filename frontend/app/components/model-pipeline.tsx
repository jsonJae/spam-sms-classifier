"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

const STEP_MS = 520;

const STAGES = [
  {
    title: "Message in",
    spec: "text.strip()",
    body: "Your pasted text, 1 to 5,000 characters. Surrounding whitespace is trimmed and the message stays in memory only.",
  },
  {
    title: "TF-IDF vectorizer",
    spec: 'TfidfVectorizer(stop_words="english", max_features=5000)',
    body: "Splits the message into words, drops common English stop words, and weighs each remaining term by how distinctive it is. The vocabulary is capped at 5,000 terms.",
  },
  {
    title: "Logistic regression",
    spec: 'LogisticRegression(class_weight="balanced")',
    body: "Every term carries a learned weight toward spam or ham. The weighted sum becomes a probability. Balanced class weights offset the 4,825 ham to 1,023 spam split.",
  },
  {
    title: "Verdict",
    spec: "predict_proba → label, confidence",
    body: "The more likely class becomes the label, and its probability is the confidence you see. Anything under 60% is flagged as borderline.",
  },
];

const TRAINING = [
  { value: "4,825", label: "ham rows, UCI SMS Spam Collection" },
  { value: "1,023", label: "spam rows, Philippine spam SMS set" },
  { value: "4,678 / 1,170", label: "train / test, stratified 80/20" },
  { value: "0.99", label: "test accuracy on that mixed split" },
];

export function ModelPipeline() {
  const ref = useRef<HTMLOListElement>(null);
  const [run, setRun] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setRun((count) => (count === 0 ? 1 : count));
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="pipeline"
      aria-labelledby="pipeline-title"
      className="mt-20 scroll-mt-28 border-t-2 border-ink pt-12 sm:mt-24"
    >
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-xl">
          <h2
            id="pipeline-title"
            className="font-display text-[clamp(28px,4.5vw,42px)] font-bold leading-tight tracking-[-0.03em] text-ink"
          >
            How the model decides
          </h2>
          <p className="mt-3 max-w-[60ch] text-sm leading-relaxed text-muted-foreground text-pretty">
            One scikit-learn pipeline turns your message into a verdict in four
            steps. Nothing else touches the score.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setRun((count) => count + 1)}
          className="inline-flex min-h-10 items-center gap-2 rounded-lg border-2 border-ink bg-card px-4 text-sm font-bold text-ink shadow-[3px_3px_0_0_#121410] transition-[transform,box-shadow,background-color] duration-200 hover:bg-paper hover:shadow-[4px_4px_0_0_#121410] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="size-4"
          >
            <path d="M3 12a9 9 0 1 0 3-6.7" />
            <path d="M3 4v5h5" />
          </svg>
          Replay
        </button>
      </div>

      <ol
        ref={ref}
        key={run}
        data-run={run > 0}
        className="pipeline mt-10 grid gap-6 lg:grid-cols-4 lg:gap-5"
      >
        {STAGES.map((stage, index) => {
          const isLast = index === STAGES.length - 1;
          const style = {
            "--node-delay": `${index * STEP_MS}ms`,
            "--track-delay": `${index * STEP_MS + 80}ms`,
            "--track-duration": `${STEP_MS - 80}ms`,
          } as CSSProperties;

          return (
            <li key={stage.title} style={style} className="relative pl-11 lg:pl-0 lg:pt-11">
              {!isLast && (
                <span
                  aria-hidden="true"
                  className="pipeline-track absolute top-[30px] left-[10px] h-[calc(100%+1.5rem-20px)] w-0.5 bg-ink/15 lg:top-[10px] lg:left-[30px] lg:h-0.5 lg:w-[calc(100%+1.25rem-20px)]"
                >
                  <span className="pipeline-track-fill absolute inset-0 bg-primary" />
                </span>
              )}

              <span
                aria-hidden="true"
                className="pipeline-node absolute top-0 left-0 grid size-[22px] place-items-center rounded-full border-2 border-ink bg-card lg:left-5"
              >
                <span className="pipeline-node-core size-2 rounded-full bg-ink/25" />
              </span>

              <article className="pipeline-card flex h-full flex-col rounded-xl border-2 border-ink bg-card p-5 shadow-[5px_5px_0_0_#121410]">
                <h3 className="font-display text-lg font-bold tracking-tight text-ink">
                  {stage.title}
                </h3>
                <p className="mt-2 flex-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  {stage.body}
                </p>
                <code className="pipeline-spec mt-4 block rounded-md border border-ink/15 bg-paper px-2.5 py-2 font-mono text-[11px] leading-snug break-words text-ink/80">
                  {stage.spec}
                </code>
                {isLast && (
                  <div className="mt-3 flex gap-2" aria-hidden="true">
                    <span className="pipeline-badge rounded-sm border-2 border-danger bg-danger-bg px-2 py-0.5 font-mono text-[10px] font-bold tracking-[0.16em] text-danger">
                      SPAM
                    </span>
                    <span className="pipeline-badge rounded-sm border-2 border-success bg-success-bg px-2 py-0.5 font-mono text-[10px] font-bold tracking-[0.16em] text-success">
                      HAM
                    </span>
                  </div>
                )}
              </article>
            </li>
          );
        })}
      </ol>

      <div className="mt-10 rounded-xl border-2 border-ink bg-paper/80 p-5 sm:p-6">
        <h3 className="font-display text-lg font-bold tracking-tight text-ink">
          What it learned from
        </h3>
        <dl className="mt-4 grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
          {TRAINING.map((item) => (
            <div key={item.label} className="border-t-2 border-ink/10 pt-3">
              <dt className="sr-only">{item.label}</dt>
              <dd className="font-display text-2xl font-bold tracking-tight text-ink tabular-nums">
                {item.value}
              </dd>
              <dd className="mt-1 text-xs leading-snug text-muted-foreground">
                {item.label}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-5 max-w-[70ch] text-xs leading-relaxed text-muted-foreground sm:text-sm">
          Each source contributes only one class, so the model can pick up
          language and source cues as well as spam cues. Read 0.99 as a result
          on this split, not a promise about every text you receive.
        </p>
      </div>
    </section>
  );
}
