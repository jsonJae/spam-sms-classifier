"use client";

import { useState, type CSSProperties } from "react";
import {
  CheckIcon,
  ClipboardIcon,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
} from "./icons";

export type Prediction = {
  label: string;
  is_spam: boolean;
  confidence: number;
};

type Tone = "spam" | "safe" | "uncertain";

const VERDICTS = {
  spam: {
    statusTag: "Threat detected",
    title: "Likely Phishing or Spam",
    summary:
      "This message exhibits standard characteristics of unsolicited spam campaigns or fraudulent phishing attempts.",
    advice: "Do not tap any links, call listed phone numbers, or reply with personal verification codes.",
    card: "border-danger/40 bg-danger-bg text-ink",
    badge: "bg-danger text-white border-danger",
    meter: "bg-danger",
    accentText: "text-danger",
  },
  safe: {
    statusTag: "Clean verification",
    title: "Appears Legitimate",
    summary:
      "No strong spam indicators or suspicious phishing patterns were detected in this message text.",
    advice: "Still exercise caution if an unexpected contact asks for urgent funds or credential changes.",
    card: "border-success/40 bg-success-bg text-ink",
    badge: "bg-success text-white border-success",
    meter: "bg-success",
    accentText: "text-success",
  },
  uncertain: {
    statusTag: "Inconclusive result",
    title: "Borderline / Low Confidence",
    summary:
      "The model's probability score is near 50/50. The message structure does not carry strong decisive signals.",
    advice: "Verify the sender through an official channel before replying or taking any requested action.",
    card: "border-warning/40 bg-warning-bg text-ink",
    badge: "bg-warning text-white border-warning",
    meter: "bg-warning",
    accentText: "text-warning",
  },
} as const;

export function ResultCard({
  result,
  scannedText,
}: {
  result: Prediction;
  scannedText?: string;
}) {
  const [copied, setCopied] = useState(false);

  const hasScore = Number.isFinite(result.confidence);
  const ratio = hasScore ? Math.min(1, Math.max(0, result.confidence)) : 0;
  const confidence = Math.round(ratio * 100);

  const tone: Tone =
    !hasScore || confidence < 60
      ? "uncertain"
      : result.is_spam
        ? "spam"
        : "safe";

  const verdict = VERDICTS[tone];
  const Icon =
    tone === "spam"
      ? ShieldAlert
      : tone === "safe"
        ? ShieldCheck
        : ShieldQuestion;

  const textLower = (scannedText ?? "").toLowerCase();
  const hasLinks = /https?:\/\/|bit\.ly|t\.co|tinyurl|\.com|\.xyz/i.test(textLower);
  const hasUrgency = /urgent|immediately|suspended|final notice|action required|blocked|verify/i.test(textLower);
  const hasBait = /won|winner|free|claim|\$|prize|gift card|lottery|payout/i.test(textLower);

  const handleCopy = () => {
    const report = `SMS Guardian Report\nVerdict: ${verdict.title}\nConfidence: ${confidence}%\nAdvice: ${verdict.advice}`;
    navigator.clipboard.writeText(report).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div
      className={`relative overflow-hidden rounded-xl border-2 p-5 sm:p-6 motion-safe:animate-result-in shadow-[5px_5px_0_0_#121410] ${verdict.card}`}
    >
      {/* Top Banner Row */}
      <div className="flex items-center justify-between gap-2 border-b border-ink/10 pb-3">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className={`grid size-7 shrink-0 place-items-center rounded-md border text-white ${verdict.badge}`}
          >
            <Icon className="size-4" />
          </span>
          <span className="text-[11px] font-semibold tracking-wide whitespace-nowrap sm:text-xs">
            {verdict.statusTag}
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-md border border-ink/20 bg-card px-2.5 py-1.5 text-xs font-medium text-ink transition hover:border-ink hover:bg-paper active:scale-95 sm:min-h-0 sm:py-1"
          title="Copy report to clipboard"
          aria-label="Copy report to clipboard"
        >
          {copied ? (
            <CheckIcon className="size-3.5 text-success" />
          ) : (
            <ClipboardIcon className="size-3.5 text-muted-foreground" />
          )}
          <span className="sm:hidden">{copied ? "Copied" : "Copy"}</span>
          <span className="hidden sm:inline">{copied ? "Copied" : "Copy report"}</span>
        </button>
      </div>

      {/* Main Verdict & Confidence Gauge */}
      <div className="mt-4 flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
          <div className="min-w-0">
            <h3 className={`font-display text-xl font-bold tracking-tight text-balance sm:text-2xl ${verdict.accentText}`}>
              {verdict.title}
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground text-pretty sm:text-sm">
              {verdict.summary}
            </p>
          </div>

          <div className="flex shrink-0 items-baseline gap-2 sm:block sm:text-right">
            <div className="flex items-baseline gap-0.5 text-3xl font-bold tracking-tight text-ink tabular-nums sm:justify-end">
              <span>{hasScore ? confidence : "n/a"}</span>
              {hasScore && <span className="text-base font-normal text-muted-foreground">%</span>}
            </div>
            <span className="text-[11px] font-medium text-muted-foreground">
              Confidence
            </span>
          </div>
        </div>

        {/* Confidence Meter Bar */}
        <div className="flex flex-col gap-1.5">
          <div
            className="h-2 w-full overflow-hidden rounded-full bg-ink/10"
            aria-hidden="true"
          >
            <div
              className={`h-full origin-left rounded-full motion-safe:animate-meter-fill ${verdict.meter}`}
              style={
                {
                  transform: `scaleX(${hasScore ? ratio : 0})`,
                  "--confidence": hasScore ? ratio : 0,
                } as CSSProperties
              }
            />
          </div>
          <div className="flex justify-between text-[11px] text-muted-foreground">
            <span>50% baseline</span>
            <span>100% certain</span>
          </div>
        </div>

        {/* Heuristic Breakdown */}
        {scannedText && (
          <div className="rounded-lg border border-ink/10 bg-card/75 p-3">
            <span className="text-xs font-semibold text-ink block mb-2">
              Detected signal factors
            </span>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 text-xs">
              <div className="flex items-center gap-2">
                <span
                  className={`size-2 rounded-full ${
                    hasLinks ? "bg-primary" : "bg-ink/20"
                  }`}
                />
                <span className={hasLinks ? "font-semibold text-ink" : "text-muted-foreground"}>
                  {hasLinks ? "Link shortener found" : "No links"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`size-2 rounded-full ${
                    hasUrgency ? "bg-primary" : "bg-ink/20"
                  }`}
                />
                <span className={hasUrgency ? "font-semibold text-ink" : "text-muted-foreground"}>
                  {hasUrgency ? "Urgency language" : "Standard tempo"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`size-2 rounded-full ${
                    hasBait ? "bg-primary" : "bg-ink/20"
                  }`}
                />
                <span className={hasBait ? "font-semibold text-ink" : "text-muted-foreground"}>
                  {hasBait ? "Prize or financial bait" : "No bait hooks"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Recommended Action */}
        <div className="rounded-lg border border-ink/10 bg-card/90 p-3 text-xs leading-relaxed text-ink">
          <span className="font-semibold text-primary block mb-0.5">
            Recommended action
          </span>
          {verdict.advice}
        </div>
      </div>
    </div>
  );
}
