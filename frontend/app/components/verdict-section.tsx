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
      ) : loading ? (
        <div
          className="relative overflow-hidden rounded-xl border-2 border-ink/20 bg-card p-5 shadow-[5px_5px_0_0_#121410] sm:p-6"
          aria-busy="true"
        >
          <span role="status" className="sr-only">
            Analyzing message. Please wait.
          </span>

          <div aria-hidden="true" className="motion-safe:animate-pulse">
            <div className="flex items-center justify-between border-b border-ink/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="size-7 rounded-md bg-ink/10" />
                <span className="h-2.5 w-24 rounded-full bg-ink/10" />
              </div>
              <span className="h-7 w-20 rounded-md bg-ink/[0.06]" />
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
              <div className="w-full space-y-2">
                <span className="block h-6 w-2/3 rounded-md bg-ink/10" />
                <span className="block h-3 w-full rounded-full bg-ink/[0.07]" />
                <span className="block h-3 w-4/5 rounded-full bg-ink/[0.07]" />
              </div>
              <div className="flex shrink-0 flex-col gap-1.5 sm:items-end">
                <span className="block h-8 w-16 rounded-md bg-ink/10" />
                <span className="block h-2.5 w-20 rounded-full bg-ink/[0.07]" />
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <span className="block h-2 w-full rounded-full bg-ink/10" />
              <div className="flex justify-between">
                <span className="h-2.5 w-16 rounded-full bg-ink/[0.07]" />
                <span className="h-2.5 w-16 rounded-full bg-ink/[0.07]" />
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-ink/10 bg-card/75 p-3">
              <span className="mb-2.5 block h-2.5 w-28 rounded-full bg-ink/10" />
              <div className="grid gap-2 sm:grid-cols-3">
                <span className="h-3 w-full rounded-full bg-ink/[0.07]" />
                <span className="h-3 w-4/5 rounded-full bg-ink/[0.07]" />
                <span className="h-3 w-3/5 rounded-full bg-ink/[0.07]" />
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-ink/10 bg-card/90 p-3">
              <span className="mb-2 block h-2.5 w-32 rounded-full bg-ink/10" />
              <span className="block h-3 w-full rounded-full bg-ink/[0.07]" />
            </div>
          </div>
        </div>
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
              Paste a message or choose a preset, then press Check message. The classifier evaluates word frequencies, link structures, and urgency patterns.
            </p>

            <div className="mt-2 flex w-full flex-col gap-2 rounded-lg border border-ink/10 bg-paper/50 p-4 text-xs text-ink">
              <div className="flex items-center gap-2 text-primary font-semibold">
                <SparklesIcon className="size-4" />
                <span>Safety reminders</span>
              </div>
              <div className="flex flex-col gap-1.5 text-muted-foreground">
                <p>1. GCash, Maya, and Philippine banks will never send clickable links to reset your MPIN or OTP.</p>
                <p>2. Beware of SMS claiming your SIM registration has expired or needs immediate reactivation.</p>
                <p>3. Do not engage with job offers offering daily wages via WhatsApp, Viber, or Telegram.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

