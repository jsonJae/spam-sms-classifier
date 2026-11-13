import { OverdriveShield, ArrowUpRight } from "./icons";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-ink bg-paper/95 pt-[env(safe-area-inset-top)] shadow-[0_4px_24px_-4px_rgba(18,20,16,0.12)] backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:gap-4 sm:px-8">
        <a href="#top" className="group flex min-w-0 items-center gap-2.5 sm:gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl border-2 border-ink bg-primary text-ink shadow-[2px_2px_0_0_#121410] transition-transform duration-200 group-hover:scale-105">
            <OverdriveShield className="size-6" animated />
          </span>
          <div className="flex min-w-0 flex-col leading-tight">
            <span className="truncate font-display text-base font-bold tracking-tight text-ink sm:text-lg">
              SMS Guardian
            </span>
            <span className="hidden text-[11px] font-medium text-muted-foreground min-[380px]:block">
              Spam classification tool
            </span>
          </div>
        </a>

        <a
          href="#scan"
          className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-lg border-2 border-ink bg-ink px-3 text-xs font-bold whitespace-nowrap text-paper shadow-[2px_2px_0_0_#ff5c1a] transition hover:bg-primary hover:text-ink active:translate-x-0.5 active:translate-y-0.5 sm:px-4"
        >
          <span className="sm:hidden">Scan</span>
          <span className="hidden sm:inline">Scan message</span>
          <ArrowUpRight className="size-3.5" />
        </a>
      </div>
    </header>
  );
}

