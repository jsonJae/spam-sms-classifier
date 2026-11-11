"use client";

import { useCallback, useEffect, useState, type FormEvent, type KeyboardEvent } from "react";

import {
  ArrowUpRight,
  ClipboardIcon,
  ClockIcon,
  GiftIcon,
  LinkIcon,
  OverdriveShield,
  RadarIcon,
  RefreshCwIcon,
  SparklesIcon,
} from "./components/icons";
import { ResultCard, type Prediction } from "./components/result-card";
import { Splash } from "./components/splash";
import { TacticalRadar } from "./components/tactical-radar";

const API_ENDPOINT = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/predict`
  : "/api/predict";

const PRESET_EXAMPLES = [
  {
    label: "Gift scam",
    text: "Congratulations! You have won a $1,000 gift card. Claim now at http://bit.ly/claim",
  },
  {
    label: "Bank urgent",
    text: "URGENT: Your bank account will be suspended. Verify your details immediately at https://secure-bank-login.xyz",
  },
  {
    label: "Parcel fee",
    text: "USPS: Your parcel is held due to $2.99 unpaid customs fee. Confirm address at parcel-tracker.net to avoid return.",
  },
  {
    label: "Safe chat",
    text: "Hey, are we still meeting for lunch tomorrow at noon? Let me know if you need a ride.",
  },
];

const SIGNALS = [
  {
    icon: LinkIcon,
    title: "Obfuscated Links",
    technique: "Domain Cloaking",
    body: "Shortened URLs, raw IPs, or newly registered domains mask the real destination and slip past basic filters.",
    advice: "Inspect the root destination before clicking any link.",
  },
  {
    icon: ClockIcon,
    title: "Manufactured Urgency",
    technique: "Psychological Coercion",
    body: "Words like 'suspended', 'final notice', or 'action required' push you to react before you can verify the sender.",
    advice: "Legitimate institutions do not demand crisis-speed action via text.",
  },
  {
    icon: GiftIcon,
    title: "Reward Bait",
    technique: "Incentive Exploitation",
    body: "Unsolicited claims of winnings, gift cards, or refunds lure you into sharing credentials or paying a processing fee.",
    advice: "Unsolicited cash or prize messages are almost always fraudulent.",
  },
];

const buttonBase =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border-2 px-6 text-[15px] font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 max-sm:w-full";

export default function Home() {
  const [text, setText] = useState("");
  const [analyzedText, setAnalyzedText] = useState("");
  const [result, setResult] = useState<Prediction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [entered, setEntered] = useState(false);
  const [pastedNotification, setPastedNotification] = useState(false);

  const charCount = text.length;
  const canSubmit = text.trim().length > 0 && !loading;

  useEffect(() => {
    if (!showSplash) return;

    document.body.style.overflow = "hidden";
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const heroTimer = window.setTimeout(
      () => setEntered(true),
      reduced ? 50 : 1600,
    );
    const splashTimer = window.setTimeout(
      () => setShowSplash(false),
      reduced ? 100 : 2800,
    );

    return () => {
      document.body.style.overflow = "";
      window.clearTimeout(heroTimer);
      window.clearTimeout(splashTimer);
    };
  }, [showSplash]);

  const dismissSplash = useCallback(() => {
    setEntered(true);
    setShowSplash(false);
  }, []);

  function reset() {
    setText("");
    setAnalyzedText("");
    setResult(null);
    setError(null);
  }

  function handleTextChange(newVal: string) {
    setText(newVal);
    if (result) setResult(null);
    if (error) setError(null);
  }

  async function handlePaste() {
    try {
      const clipText = await navigator.clipboard.readText();
      if (clipText) {
        handleTextChange(clipText.slice(0, 5000));
        setPastedNotification(true);
        setTimeout(() => setPastedNotification(false), 1800);
      }
    } catch {
      // Clipboard access unavailable or blocked
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && canSubmit) {
      e.preventDefault();
      executeScan();
    }
  }

  async function executeScan() {
    if (!canSubmit) return;

    setLoading(true);
    setError(null);
    setResult(null);
    const targetText = text.trim();
    setAnalyzedText(targetText);

    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: targetText }),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as {
          detail?: unknown;
        } | null;
        throw new Error(
          typeof body?.detail === "string"
            ? body.detail
            : "The classification engine could not process that message.",
        );
      }

      const data = (await response.json()) as Prediction;
      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to reach the classification endpoint. Verify the backend is running.",
      );
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    executeScan();
  }

  function loadSample(sampleText: string) {
    handleTextChange(sampleText);
    const scanElem = document.getElementById("scan");
    if (scanElem) {
      scanElem.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <div data-entered={entered} className="min-h-screen selection:bg-primary selection:text-ink">
      <noscript>
        <style>{`[data-splash]{display:none!important}`}</style>
      </noscript>

      {showSplash && <Splash onDone={dismissSplash} />}

      {/* Sticky Header */}
      <header className="sticky top-0 z-50 w-full border-b-2 border-ink bg-paper/95 shadow-[0_4px_24px_-4px_rgba(18,20,16,0.12)] backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
          <a href="#top" className="flex items-center gap-3 group">
            <span className="grid size-10 place-items-center rounded-xl border-2 border-ink bg-primary text-ink shadow-[2px_2px_0_0_#121410] transition-transform duration-200 group-hover:scale-105">
              <OverdriveShield className="size-6" animated />
            </span>
            <div className="flex flex-col leading-tight">
              <span className="font-display text-lg font-bold tracking-tight text-ink">
                SMS Guardian
              </span>
              <span className="text-[11px] text-muted-foreground font-medium">
                Spam classification tool
              </span>
            </div>
          </a>

          <a
            href="#scan"
            className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border-2 border-ink bg-ink px-4 text-xs font-bold text-paper shadow-[2px_2px_0_0_#ff5c1a] transition hover:bg-primary hover:text-ink active:translate-x-0.5 active:translate-y-0.5"
          >
            <span>Scan message</span>
            <ArrowUpRight className="size-3.5" />
          </a>
        </div>
      </header>

      {/* Hero */}
      <section
        id="top"
        className="relative overflow-hidden border-b-2 border-ink bg-[#080a08] text-paper pt-10 pb-14 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-24"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-20 size-[520px] rounded-full bg-primary/10 blur-[140px]"
        />

        <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <div className="hero-enter flex flex-col items-start gap-6">
            <h1 className="font-display text-[clamp(40px,7.5vw,78px)] font-bold leading-[0.93] tracking-[-0.04em] text-balance">
              Verify suspicious <span className="text-primary underline decoration-primary/40 underline-offset-8">text messages</span> instantly.
            </h1>

            <p className="max-w-xl text-base leading-relaxed text-paper/70 text-pretty">
              Paste a banking alert, delivery notice, or unfamiliar text. The classifier returns an objective verdict and confidence score in under 20 milliseconds.
            </p>

            <div className="flex flex-wrap gap-2.5 text-xs">
              <span className="rounded-lg border border-paper/15 bg-paper/[0.04] px-3 py-1.5 text-paper/80">
                <span className="text-primary font-semibold mr-1.5">Capacity:</span> 5,000 characters
              </span>
              <span className="rounded-lg border border-paper/15 bg-paper/[0.04] px-3 py-1.5 text-paper/80">
                <span className="text-primary font-semibold mr-1.5">Model:</span> Scikit-Learn pipeline
              </span>
              <span className="rounded-lg border border-paper/15 bg-paper/[0.04] px-3 py-1.5 text-paper/80">
                <span className="text-primary font-semibold mr-1.5">Privacy:</span> In-memory, zero logs
              </span>
            </div>
          </div>

          {/* Tactical Radar */}
          <div
            className="hero-enter hidden w-full lg:block"
            style={{ animationDelay: "150ms" }}
          >
            <TacticalRadar onSelectMessage={loadSample} />
          </div>
        </div>
      </section>

      {/* Scanner */}
      <main
        id="scan"
        className="relative z-10 mx-auto w-full max-w-6xl scroll-mt-28 px-5 pt-12 sm:px-8 sm:pt-16 pb-20"
      >
        <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
          {/* Input Form */}
          <form
            onSubmit={handleSubmit}
            className="rounded-xl border-2 border-ink bg-card p-6 shadow-[8px_8px_0_0_#121410] sm:p-8"
          >
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 pb-4">
              <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
                Inspect a message
              </h2>
              <span className="rounded border border-ink/15 bg-paper/60 px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                POST /predict
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between gap-3">
                <label
                  htmlFor="message"
                  className="text-xs font-semibold text-ink"
                >
                  Message text
                </label>
                <div className="flex items-center gap-3">
                  {pastedNotification && (
                    <span className="text-xs text-accent font-semibold animate-pulse">
                      Pasted from clipboard
                    </span>
                  )}
                  <span
                    className={`text-xs tabular-nums font-medium ${
                      charCount > 4500 ? "text-danger font-bold" : "text-muted-foreground"
                    }`}
                  >
                    {charCount.toLocaleString("en-US")} / 5,000
                  </span>
                </div>
              </div>

              <textarea
                id="message"
                className="min-h-[160px] w-full resize-y rounded-lg border-2 border-ink/25 bg-paper/50 px-4 py-3.5 text-[15px] leading-relaxed text-ink transition placeholder:text-ink/35 hover:border-ink/50 focus:border-primary focus:bg-paper"
                value={text}
                onChange={(event) => handleTextChange(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Paste the SMS or chat message you want to verify..."
                rows={5}
                maxLength={5000}
                required
              />

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-accent" />
                  Processed in memory. Nothing is stored.
                </span>
                <span className="hidden sm:inline-block text-[11px] text-muted-foreground/80">
                  Ctrl + Enter to submit
                </span>
              </div>
            </div>

            {/* Preset Samples */}
            <div className="mt-5 border-t border-ink/10 pt-4">
              <span className="text-xs font-semibold text-muted-foreground block mb-2.5">
                Try a preset:
              </span>
              <div className="flex flex-wrap gap-2">
                {PRESET_EXAMPLES.map((sample) => (
                  <button
                    key={sample.label}
                    type="button"
                    onClick={() => handleTextChange(sample.text)}
                    className="inline-flex items-center gap-1.5 rounded-md border border-ink/20 bg-paper/70 px-3 py-1.5 text-xs font-semibold text-ink transition hover:border-ink hover:bg-primary hover:text-ink active:scale-98"
                  >
                    <span className="size-1.5 rounded-full bg-primary" />
                    <span>{sample.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-wrap gap-3 max-sm:flex-col">
              <button
                type="submit"
                disabled={!canSubmit}
                aria-busy={loading}
                className={`${buttonBase} border-ink bg-primary text-ink shadow-[4px_4px_0_0_#121410] hover:bg-primary-hover hover:shadow-[6px_6px_0_0_#121410] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[0_0_0_0_#121410]`}
              >
                {loading ? (
                  <>
                    <RefreshCwIcon className="size-4 animate-spin text-ink" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <RadarIcon className="size-4" />
                    <span>Check message</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handlePaste}
                disabled={loading}
                className={`${buttonBase} border-ink/30 bg-card text-ink hover:border-ink hover:bg-paper active:scale-98`}
                title="Paste text from clipboard"
              >
                <ClipboardIcon className="size-4" />
                <span>Paste</span>
              </button>

              <button
                type="button"
                onClick={reset}
                disabled={loading || (!text && !result && !error)}
                className={`${buttonBase} border-ink/20 bg-transparent text-muted-foreground hover:border-ink hover:text-ink`}
              >
                Clear
              </button>
            </div>
          </form>

          {/* Verdict */}
          <div
            className="flex flex-col gap-4"
            aria-live="polite"
            aria-atomic="true"
          >
            {error ? (
              <div
                role="alert"
                className="flex flex-col gap-3 rounded-xl border-2 border-danger/40 bg-danger-bg p-5 text-danger motion-safe:animate-result-in shadow-[5px_5px_0_0_#121410]"
              >
                <strong className="font-display text-lg font-bold">
                  Connection Error
                </strong>
                <p className="break-words text-xs leading-relaxed text-danger/90 sm:text-sm">
                  {error}
                </p>
                <button
                  type="button"
                  onClick={executeScan}
                  className="self-start rounded border border-danger/40 bg-white/80 px-3 py-1 text-xs font-semibold text-danger hover:bg-white"
                >
                  Retry request
                </button>
              </div>
            ) : result ? (
              <ResultCard result={result} scannedText={analyzedText} />
            ) : (
              <div className="rounded-xl border-2 border-dashed border-ink/25 bg-card/60 p-6 sm:p-7">
                <div className="flex items-center justify-between border-b border-ink/10 pb-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="size-2 rounded-full bg-ink/25" aria-hidden="true" />
                    <span className="font-medium">Standby</span>
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">
                    Ready
                  </span>
                </div>

                <div className="mt-5 flex flex-col items-start gap-3">
                  <h3 className="font-display text-xl font-bold tracking-tight text-ink">
                    Awaiting message input
                  </h3>
                  <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm text-pretty">
                    Paste a message or choose a preset, then press check message. The classifier evaluates word frequencies, link structures, and urgency patterns.
                  </p>

                  <div className="mt-2 flex w-full flex-col gap-2 rounded-lg border border-ink/10 bg-paper/50 p-4 text-xs text-ink">
                    <div className="flex items-center gap-2 text-primary font-semibold">
                      <SparklesIcon className="size-4" />
                      <span>Safety reminders</span>
                    </div>
                    <div className="flex flex-col gap-1.5 text-muted-foreground">
                      <p>1. Never click shortened or unverified links from unknown senders.</p>
                      <p>2. Legitimate banks never ask for passwords or PINs via text.</p>
                      <p>3. Verify unexpected delivery notices directly on the courier&apos;s official app.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Threat Signals */}
        <section
          id="signals"
          className="mt-20 scroll-mt-28 border-t-2 border-ink pt-12 sm:mt-24"
        >
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-xl">
              <h2 className="font-display text-[clamp(28px,4.5vw,42px)] font-bold leading-tight tracking-[-0.03em] text-ink">
                Common threat patterns
              </h2>
            </div>
            <p className="max-w-xs text-xs leading-relaxed text-muted-foreground sm:text-sm text-pretty">
              Three primary signal categories the classifier checks for in every message.
            </p>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {SIGNALS.map(({ icon: Icon, title, technique, body, advice }) => (
              <article
                key={title}
                className="group flex flex-col justify-between rounded-xl border-2 border-ink bg-card p-6 shadow-[5px_5px_0_0_#121410] transition-transform duration-200 motion-safe:hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="grid size-11 place-items-center rounded-lg border-2 border-ink bg-paper text-ink transition-colors group-hover:bg-primary group-hover:text-ink">
                      <Icon className="size-5" />
                    </span>
                    <span className="rounded border border-ink/15 bg-paper/70 px-2 py-0.5 text-xs font-medium text-muted-foreground">
                      {technique}
                    </span>
                  </div>

                  <h3 className="mt-4 font-display text-xl font-bold tracking-tight text-ink">
                    {title}
                  </h3>

                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                    {body}
                  </p>
                </div>

                <div className="mt-5 rounded border border-ink/10 bg-paper/60 p-2.5 text-xs text-ink">
                  <span className="text-primary font-semibold mr-1">Guideline:</span>
                  {advice}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Privacy & Architecture */}
        <section className="mt-16 rounded-xl border-2 border-ink bg-paper/80 p-6 sm:p-8">
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <h4 className="font-display text-lg font-bold text-ink">
                Zero persistence
              </h4>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                Message payloads are processed in memory and discarded immediately. No logs, databases, or cookies track your scans.
              </p>
            </div>

            <div>
              <h4 className="font-display text-lg font-bold text-ink">
                Scikit-Learn + FastAPI
              </h4>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                Trained on real-world SMS corpora. TF-IDF tokenization generates calibrated probabilistic verdicts.
              </p>
            </div>

            <div>
              <h4 className="font-display text-lg font-bold text-ink">
                Sub-20ms evaluation
              </h4>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                Built for quick decisions before you answer phone prompts, verify accounts, or tap unknown links.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-ink bg-[#080a08] text-paper">
        <div className="mx-auto w-full max-w-6xl px-5 pt-12 sm:px-8">
          <div className="flex flex-wrap items-start justify-between gap-10 pb-10">
            <div className="max-w-sm">
              <div className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-lg border-2 border-primary/40 bg-ink text-primary">
                  <OverdriveShield className="size-6" />
                </span>
                <span className="font-display text-lg font-bold tracking-tight text-paper">
                  SMS Guardian
                </span>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-paper/60 text-pretty sm:text-sm">
                A fast, private classifier for text messages. Built to give an objective second opinion before you tap.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs text-paper/50 font-medium">
                <span>FastAPI</span>
                <span>·</span>
                <span>Scikit-Learn</span>
                <span>·</span>
                <span>Next.js 16</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-10 sm:gap-16 text-xs">
              <div>
                <p className="font-semibold text-paper/50">
                  Navigation
                </p>
                <ul className="mt-3 flex flex-col gap-2 text-paper/70">
                  <li>
                    <a href="#scan" className="transition hover:text-primary">
                      Scan message
                    </a>
                  </li>
                  <li>
                    <a href="#signals" className="transition hover:text-primary">
                      Threat signals
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-paper/50">
                  Endpoints
                </p>
                <ul className="mt-3 flex flex-col gap-2 text-paper/70">
                  <li>POST /predict</li>
                  <li>GET /health</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 border-t border-paper/10 py-6 text-xs text-paper/45 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 SMS Guardian</p>
            <p>Verdicts are probabilistic estimates, not legal advice.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
