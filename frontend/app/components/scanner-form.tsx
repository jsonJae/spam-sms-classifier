"use client";

import { type FormEvent, type KeyboardEvent } from "react";
import { RadarIcon, RefreshCwIcon, TrashIcon } from "./icons";

export type PresetExample = {
  label: string;
  text: string;
};

export const PRESET_EXAMPLES: PresetExample[] = [
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

export function ScannerForm({
  text,
  loading,
  canSubmit,
  onTextChange,
  onReset,
  onSubmit,
}: {
  text: string;
  loading: boolean;
  canSubmit: boolean;
  onTextChange: (val: string) => void;
  onReset: () => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}) {
  const charCount = text.length;

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && canSubmit) {
      e.preventDefault();
      const form = e.currentTarget.closest("form");
      if (form) {
        form.requestSubmit();
      }
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-xl border-2 border-ink bg-card p-5 shadow-[8px_8px_0_0_#121410] sm:p-8"
    >
      <div className="mb-5 border-b border-ink/10 pb-4">
        <h2 className="font-display text-xl font-bold tracking-tight text-ink sm:text-2xl">
          Inspect a message
        </h2>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor="message"
            className="text-xs font-semibold text-ink"
          >
            Message text
          </label>

          <button
            type="button"
            onClick={onReset}
            disabled={loading || !text}
            className="group inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-md border border-ink/20 bg-paper/80 px-3 py-2 text-xs font-semibold text-muted-foreground shadow-[1px_1px_0_0_#121410] transition-all hover:border-danger hover:bg-danger-bg hover:text-danger active:translate-x-0.5 active:translate-y-0.5 active:shadow-[0_0_0_0_#121410] disabled:cursor-not-allowed disabled:border-ink/10 disabled:bg-paper/40 disabled:text-ink/30 disabled:shadow-none"
            title="Clear message"
            aria-label="Clear message"
          >
            <TrashIcon className="size-3.5 transition-transform group-hover:rotate-12 group-disabled:rotate-0" />
            <span>Clear</span>
          </button>
        </div>

        <div className="overflow-hidden rounded-lg border-2 border-ink/25 bg-paper/50 transition hover:border-ink/50 focus-within:border-primary focus-within:bg-paper">
          <textarea
            id="message"
            className="block min-h-[150px] w-full resize-none bg-transparent px-4 py-3.5 text-base leading-relaxed text-ink placeholder:text-ink/35 focus:outline-none sm:min-h-[160px]"
            value={text}
            onChange={(event) => onTextChange(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Paste the SMS or chat message you want to verify..."
            rows={5}
            maxLength={5000}
            required
          />

          <div className="flex items-center justify-end border-t border-ink/10 px-3 py-1.5">
            <span
              className={`font-mono text-[11px] font-medium tabular-nums tracking-[0.08em] ${
                charCount > 4500 ? "text-danger font-bold" : "text-muted-foreground"
              }`}
            >
              {charCount.toLocaleString("en-US")}
              <span className="hidden min-[360px]:inline"> / 5,000</span>
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="size-1.5 shrink-0 rounded-full bg-accent" />
            Processed in memory. Nothing is stored.
          </span>
          <span className="hidden text-[11px] text-muted-foreground/80 sm:inline-block">
            Ctrl + Enter to submit
          </span>
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          aria-busy={loading}
          className="mt-2 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border-2 border-ink bg-primary px-4 text-sm font-bold text-ink shadow-[3px_3px_0_0_#121410] transition hover:bg-primary-hover hover:shadow-[4px_4px_0_0_#121410] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[0_0_0_0_#121410] disabled:cursor-not-allowed disabled:opacity-50"
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
              onClick={() => onTextChange(sample.text)}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-md border border-ink/20 bg-paper/70 px-3 py-2 text-xs font-semibold text-ink transition hover:border-ink hover:bg-primary hover:text-ink active:scale-98"
            >
              <span className="size-1.5 rounded-full bg-primary" />
              <span>{sample.label}</span>
            </button>
          ))}
        </div>
      </div>
    </form>
  );
}

