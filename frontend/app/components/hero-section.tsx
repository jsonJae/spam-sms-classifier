import { ArrowUpRight, GithubIcon } from "./icons";
import { TacticalRadar } from "./tactical-radar";

export function HeroSection() {
  return (
    <section
      id="top"
      className="relative overflow-hidden border-b-2 border-ink bg-[#080a08] text-paper pt-24 pb-16 sm:pt-28 sm:pb-20 lg:pt-32 lg:pb-24"
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

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-[1.12fr_0.88fr] lg:gap-14">
        <div className="hero-enter flex flex-col items-center gap-6 text-center lg:items-start lg:text-left">
          <h1 className="font-display text-[clamp(38px,6.8vw,74px)] font-bold leading-[0.95] tracking-[-0.035em] text-balance">
            Verify suspicious <span className="relative inline-block text-primary underline decoration-primary/40 underline-offset-8 transition-transform duration-300 hover:scale-[1.02]">text messages</span> instantly.
          </h1>

          <p className="max-w-xl text-base leading-relaxed text-paper/70 text-pretty sm:text-lg">
            Paste an unverified GCash alert, bank warning, or delivery SMS. The engine evaluates threat patterns and returns calibrated probabilities in under 20 milliseconds.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2 lg:justify-start">
            <a
              href="https://github.com/jsonJae/spam-sms-classifier"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View the SMS Guardian source code on GitHub"
              className="group relative inline-flex min-h-12 items-center justify-center gap-2.5 overflow-hidden rounded-xl border-2 border-primary bg-primary px-6 text-sm font-bold text-ink shadow-[4px_4px_0_0_#ffffff] transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-[6px_6px_0_0_#ffffff] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_0_#ffffff]"
            >
              {/* Subtle gloss hover highlight */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
              />

              <GithubIcon className="size-4 transition-transform duration-200 group-hover:scale-110" />
              <span>View on GitHub</span>
              <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>

            <a
              href="#scan"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border-2 border-paper/20 bg-paper/[0.04] px-5 text-sm font-semibold text-paper/90 backdrop-blur-sm transition-all duration-200 hover:border-paper/40 hover:bg-paper/[0.09] hover:text-paper active:translate-y-px"
            >
              <span>Scan a message</span>
              <span aria-hidden="true">&darr;</span>
            </a>
          </div>
        </div>

        {/* Tactical Radar */}
        <div
          className="hero-enter hidden w-full lg:block motion-safe:animate-[float-slow_8s_ease-in-out_infinite]"
          style={{ animationDelay: "150ms" }}
        >
          <TacticalRadar />
        </div>
      </div>
    </section>
  );
}

