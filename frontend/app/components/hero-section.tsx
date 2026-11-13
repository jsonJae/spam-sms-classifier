import { ArrowUpRight, GithubIcon } from "./icons";
import { TacticalRadar } from "./tactical-radar";

export function HeroSection({
  onSelectSample,
}: {
  onSelectSample?: (text: string) => void;
} = {}) {
  return (
    <section
      id="top"
      className="relative overflow-hidden border-b-2 border-ink bg-[#080a08] text-paper pt-12 pb-16 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-24"
    >
      {/* Animated background ambient glow spheres */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-20 size-[540px] rounded-full bg-primary/15 blur-[140px] motion-safe:animate-[pulse-glow_6s_ease-in-out_infinite]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-28 bottom-0 size-[420px] rounded-full bg-accent/10 blur-[130px] motion-safe:animate-[pulse-glow_8s_ease-in-out_infinite_2s]"
      />

      {/* Subtle grid background overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(243,239,228,0.06)_1px,transparent_1px)] [background-size:24px_24px] opacity-70"
      />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-4 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
        <div className="hero-enter flex flex-col items-center gap-6 text-center lg:items-start lg:text-left">
          <h1 className="max-w-[18ch] font-display text-[clamp(40px,7.5vw,78px)] font-bold leading-[0.93] tracking-[-0.04em] text-balance lg:max-w-none">
            Verify suspicious <span className="relative inline-block text-primary underline decoration-primary/40 underline-offset-8 transition-transform duration-300 hover:scale-[1.02]">text messages</span> instantly.
          </h1>

          <p className="mx-auto max-w-xl text-base leading-relaxed text-paper/70 text-pretty sm:text-lg lg:mx-0">
            Paste a banking alert, delivery notice, or unfamiliar text. The classifier returns an objective verdict and confidence score in under 20 milliseconds.
          </p>

          <div className="flex max-w-full flex-wrap items-center justify-center gap-2 pt-2 text-xs lg:justify-start">
            <span className="shrink-0 whitespace-nowrap rounded-lg border border-paper/15 bg-paper/[0.04] px-3 py-1.5 text-paper/80 transition-colors hover:border-paper/30">
              <span className="text-primary font-semibold mr-1.5">Capacity:</span> 5,000 characters
            </span>
            <span className="shrink-0 whitespace-nowrap rounded-lg border border-paper/15 bg-paper/[0.04] px-3 py-1.5 text-paper/80 transition-colors hover:border-paper/30">
              <span className="text-primary font-semibold mr-1.5">Model:</span> Scikit-Learn pipeline
            </span>
            <span className="shrink-0 whitespace-nowrap rounded-lg border border-paper/15 bg-paper/[0.04] px-3 py-1.5 text-paper/80 transition-colors hover:border-paper/30">
              <span className="text-primary font-semibold mr-1.5">Privacy:</span> In-memory, zero logs
            </span>
            <a
              href="https://github.com/jsonJae/spam-sms-classifier"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View the SMS Guardian source code on GitHub"
              className="group inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border border-paper/15 bg-paper/[0.04] px-3 py-1.5 text-paper/80 transition-colors hover:border-primary/60 hover:bg-primary/10 hover:text-paper"
            >
              <GithubIcon className="size-3.5 text-paper/60 transition-colors group-hover:text-primary" />
              <span className="font-semibold text-primary">GitHub:</span> View source
              <ArrowUpRight className="size-3 text-paper/50 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>

        {/* Tactical Radar */}
        <div
          className="hero-enter hidden w-full lg:block motion-safe:animate-[float-slow_8s_ease-in-out_infinite]"
          style={{ animationDelay: "150ms" }}
        >
          <TacticalRadar onSelectMessage={onSelectSample} />
        </div>
      </div>
    </section>
  );
}

