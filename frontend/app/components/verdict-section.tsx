import { SparklesIcon } from "./icons";
import { ResultCard, type Prediction } from "./result-card";

export function VerdictSection({
  loading,
  error,
  result,
  analyzedText,
  onRetry,
}: {
  loading: boolean;
  error: string | null;
  result: Prediction | null;
  analyzedText: string;
  onRetry: () => void;
}) {
  return (
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
            onClick={onRetry}
            disabled={loading}
            className="self-start rounded border border-danger/40 bg-white/80 px-3 py-1 text-xs font-semibold text-danger hover:bg-white"
          >
            Retry request
          </button>
        </div>
      ) : result ? (
        <ResultCard result={result} scannedText={analyzedText} />
      ) : (
        <div className="rounded-xl border-2 border-dashed border-ink/25 bg-card/60 p-5 sm:p-7">
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
            <h3 className="font-display text-lg font-bold tracking-tight text-ink sm:text-xl">
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
  );
}

