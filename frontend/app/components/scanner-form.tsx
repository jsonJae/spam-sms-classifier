"use client";

import { useRef, type FormEvent, type KeyboardEvent } from "react";
import { RadarIcon, RefreshCwIcon, TrashIcon } from "./icons";

export type PresetExample = {
  label: string;
  text: string;
};

export const PRESET_EXAMPLES: PresetExample[] = [
  {
    label: "GCash subsidy",
    text: "GCash: Your account received PHP 1,500 Ayuda subsidy bonus. Claim now at http://gcash-rebates-portal.net",
  },
  {
    label: "BDO locked",
    text: "BDO Alert: Your online banking account has been locked. Verify immediately at https://bdo-online-security.xyz",
  },
  {
    label: "SIM advisory",
    text: "Globe/GCash Advisory: Your SIM card will be deactivated in 24 hours. Update your SIM at http://sim-registration-portal.com",
  },
  {
    label: "Safe meetup",
    text: "Hey bro, are we still meeting in Megamall at 5pm? Let me know when you arrive.",
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
  const hasText = text.trim().length > 0;
  const isActionable = canSubmit || loading;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && canSubmit) {
      e.preventDefault();
      const form = e.currentTarget.closest("form");
      if (form) {
        form.requestSubmit();
      }
    }
  }

  function handleReset() {
    onReset();
    textareaRef.current?.focus();
  }

  function renderSubmitButton(className: string) {
    return (
      <button
        type="submit"
        disabled={!canSubmit}
        aria-busy={loading}
        className={`items-center justify-center gap-2 rounded-lg border-2 font-bold transition-[background-color,box-shadow,transform,color,border-color] duration-200 ${className} ${
          isActionable
            ? "cursor-pointer border-ink bg-primary text-ink shadow-[3px_3px_0_0_#121410] hover:bg-primary-hover hover:shadow-[4px_4px_0_0_#121410] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[0_0_0_0_#121410]"
            : "cursor-not-allowed border-ink/25 bg-ink/[0.04] text-ink/40 shadow-none"
        }`}
      >
        <span className="grid place-items-center">
          <span
            aria-hidden={loading}
            className={`col-start-1 row-start-1 inline-flex items-center gap-2 transition-opacity duration-150 ${
              loading ? "opacity-0" : "opacity-100"
            }`}
          >
            <RadarIcon className="size-4" />
            <span>Check message</span>
          </span>
          <span
            aria-hidden={!loading}
            className={`col-start-1 row-start-1 inline-flex items-center gap-2 transition-opacity duration-150 ${
              loading ? "opacity-100" : "opacity-0"
            }`}
          >
            <RefreshCwIcon className="size-4 animate-spin" />
            <span>Analyzing...</span>
          </span>
        </span>
      </button>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-xl border-2 border-ink bg-card p-5 shadow-[8px_8px_0_0_#121410] sm:p-8"
    >
      <div className="mb-5 flex items-start justify-between gap-4 border-b border-ink/10 pb-4">
        <div className="min-w-0">
          <h2 className="font-display text-xl font-bold tracking-tight text-ink sm:text-2xl">
            Inspect a message
          </h2>
          <p className="mt-1 hidden text-xs text-muted-foreground sm:block">
            Paste a message to get an instant spam or ham verdict.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2 pt-0.5">
          {renderSubmitButton(
            "hidden min-h-11 px-5 text-xs sm:inline-flex sm:min-w-[10.5rem]",
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <label htmlFor="message" className="text-xs font-semibold text-ink">
            Message text
          </label>

          <button
            type="button"
            onClick={handleReset}
            disabled={loading || !hasText}
            className="group inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-md border border-ink/20 bg-paper/80 px-3 py-2 text-xs font-semibold text-muted-foreground shadow-[1px_1px_0_0_#121410] transition-all hover:border-danger hover:bg-danger-bg hover:text-danger active:translate-x-0.5 active:translate-y-0.5 active:shadow-[0_0_0_0_#121410] disabled:cursor-not-allowed disabled:border-ink/10 disabled:bg-paper/40 disabled:text-ink/30 disabled:shadow-none"
            title="Clear message"
            aria-label="Clear message"
          >
            <TrashIcon className="size-3.5 transition-transform group-hover:rotate-12 group-disabled:rotate-0" />
            <span>Clear</span>
          </button>
        </div>

        <div className="overflow-hidden rounded-lg border-2 border-ink/25 bg-paper/50 transition-colors duration-200 hover:border-ink/50 focus-within:border-primary focus-within:bg-paper">
          <textarea
            ref={textareaRef}
            id="message"
            className="block min-h-[150px] w-full resize-none bg-transparent px-4 py-3.5 text-base leading-relaxed text-ink placeholder:text-ink/35 focus:outline-none sm:min-h-[160px]"
            value={text}
            onChange={(event) => onTextChange(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Paste the SMS or chat message you want to verify..."
            rows={5}
            maxLength={5000}
            aria-describedby="message-count"
            required
          />

          <div className="flex items-center justify-between gap-3 border-t border-ink/10 px-3 py-1.5">
            <span className="flex min-w-0 items-center gap-1.5 text-[11px] text-muted-foreground">
              <span className="size-1.5 shrink-0 rounded-full bg-accent" />
              <span className="truncate">Processed in memory. Nothing is stored.</span>
            </span>
            <span
              id="message-count"
              className={`shrink-0 font-mono text-[11px] font-medium tabular-nums tracking-[0.08em] ${
                charCount > 4500 ? "text-danger font-bold" : "text-muted-foreground"
              }`}
            >
              {charCount.toLocaleString("en-US")}
              <span className="hidden min-[360px]:inline"> / 5,000</span>
            </span>
          </div>
        </div>
      </div>

      {/* Preset Samples */}
      <div className="mt-5 border-t border-ink/10 pt-4">
        <span className="mb-2.5 block text-xs font-semibold text-muted-foreground">
          Try a preset:
        </span>
        <div className="flex flex-wrap gap-2">
          {PRESET_EXAMPLES.map((sample) => (
            <button
              key={sample.label}
              type="button"
              disabled={loading}
              onClick={() => onTextChange(sample.text)}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-md border border-ink/20 bg-paper/70 px-3 py-2 text-xs font-semibold text-ink transition hover:border-ink hover:bg-primary active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-ink/20 disabled:hover:bg-paper/70"
            >
              <span className="size-1.5 rounded-full bg-primary" />
              <span>{sample.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Action Bar */}
      <div className="mt-5 flex flex-col gap-3 border-t border-ink/10 pt-4 sm:hidden">
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          {loading
            ? "Scanning the message against the classifier..."
            : hasText
              ? "Ready to classify. The verdict appears in the results panel."
              : "Paste a message or pick a preset to enable scanning."}
        </p>

        {renderSubmitButton("flex min-h-12 w-full px-5 text-sm")}
      </div>
    </form>
  );
}
