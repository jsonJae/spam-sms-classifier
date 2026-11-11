import { OverdriveShield, ArrowUpRight } from "./icons";

export function SiteHeader() {
  return (
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
  );
}

