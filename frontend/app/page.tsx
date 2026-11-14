"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { HeroSection } from "./components/hero-section";
import { type Prediction } from "./components/result-card";
import { ScannerForm } from "./components/scanner-form";
import { SiteFooter } from "./components/site-footer";
import { SiteHeader } from "./components/site-header";
import { SlideReveal } from "./components/slide-reveal";
import { Splash } from "./components/splash";
import { ThreatSignals } from "./components/threat-signals";
import { VerdictSection } from "./components/verdict-section";

const API_ENDPOINT = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/predict`
  : "/api/predict";

export default function Home() {
  const [text, setText] = useState("");
  const [analyzedText, setAnalyzedText] = useState("");
  const [result, setResult] = useState<Prediction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [entered, setEntered] = useState(false);

  const canSubmit = text.trim().length > 0 && !loading;

  useEffect(() => {
    if (!showSplash) return;

    document.body.style.overflow = "hidden";
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const heroTimer = window.setTimeout(
      () => setEntered(true),
      reduced ? 50 : 1300,
    );
    const splashTimer = window.setTimeout(
      () => setShowSplash(false),
      reduced ? 100 : 2100,
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

  return (
    <div data-entered={entered} className="min-h-dvh selection:bg-primary selection:text-ink">
      <noscript>
        <style>{`[data-splash]{display:none!important}`}</style>
      </noscript>

      {showSplash && <Splash onDone={dismissSplash} />}

      {/* Fixed Sticky Header */}
      <SiteHeader />

      {/* Hero */}
      <HeroSection />

      {/* Scanner Main Section */}
      <main
        id="scan"
        className="relative z-10 mx-auto w-full max-w-6xl scroll-mt-28 px-4 pt-12 pb-20 sm:px-8 sm:pt-16"
      >
        <SlideReveal>
          <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
            <ScannerForm
              text={text}
              loading={loading}
              canSubmit={canSubmit}
              onTextChange={handleTextChange}
              onReset={reset}
              onSubmit={handleSubmit}
            />

            <VerdictSection
              loading={loading}
              error={error}
              result={result}
              analyzedText={analyzedText}
              onRetry={executeScan}
            />
          </div>
        </SlideReveal>

        {/* Threat Signals */}
        <SlideReveal delay={60}>
          <ThreatSignals />
        </SlideReveal>

        {/* Privacy, Documentation & Architecture */}
        <SlideReveal delay={60}>
          <section id="docs" className="mt-16 scroll-mt-28 rounded-xl border-2 border-ink bg-paper/80 p-5 sm:p-8">
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
        </SlideReveal>
      </main>

      {/* Footer */}
      <SiteFooter />
    </div>
  );
}
