"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Faq } from "./components/faq";
import { HeroSection } from "./components/hero-section";
import { ModelPipeline } from "./components/model-pipeline";
import { type Prediction } from "./components/result-card";
import { ScannerForm } from "./components/scanner-form";
import { SiteFooter } from "./components/site-footer";
import { SiteHeader } from "./components/site-header";
import { SlideReveal } from "./components/slide-reveal";
import { Splash } from "./components/splash";
import { ThreatSignals } from "./components/threat-signals";
import { VerdictSection } from "./components/verdict-section";
import { requestPrediction } from "./lib/predict";

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
      setResult(await requestPrediction(targetText));
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

      <main className="relative z-10">
        {/* Scanner */}
        <section
          id="scan"
          aria-label="Message scanner"
          className="mx-auto w-full max-w-6xl scroll-mt-28 px-4 pt-12 pb-20 sm:px-8 sm:pt-16 sm:pb-28"
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
        </section>

        {/* Threat signals */}
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-8">
          <div className="border-t-2 border-ink pt-12 pb-20 sm:pt-16 sm:pb-24">
            <SlideReveal delay={60}>
              <ThreatSignals />
            </SlideReveal>
          </div>
        </div>

        {/* Model pipeline, training data, privacy */}
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-8">
          <div className="border-t-2 border-ink pt-12 pb-20 sm:pt-16 sm:pb-24">
            <SlideReveal delay={60}>
              <ModelPipeline
                lastScan={
                  result && analyzedText
                    ? { text: analyzedText, prediction: result }
                    : null
                }
              />
            </SlideReveal>
          </div>
        </div>

        {/* FAQ */}
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-8">
          <div className="border-t-2 border-ink pt-12 pb-20 sm:pt-16 sm:pb-24">
            <SlideReveal delay={60}>
              <Faq />
            </SlideReveal>
          </div>
        </div>
      </main>

      {/* Footer */}
      <SiteFooter />
    </div>
  );
}
