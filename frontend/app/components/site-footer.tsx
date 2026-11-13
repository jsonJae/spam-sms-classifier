import { OverdriveShield } from "./icons";

export function SiteFooter() {
  return (
    <footer className="border-t-2 border-ink bg-[#080a08] text-paper">
      <div className="mx-auto w-full max-w-6xl px-4 pt-12 sm:px-8">
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

        <div className="flex flex-col gap-2 border-t border-paper/10 pt-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] text-xs text-paper/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 SMS Guardian</p>
          <p>Verdicts are probabilistic estimates, not legal advice.</p>
        </div>
      </div>
    </footer>
  );
}

