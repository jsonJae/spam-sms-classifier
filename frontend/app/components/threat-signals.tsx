import { LinkIcon, ClockIcon, GiftIcon } from "./icons";

export const SIGNALS = [
  {
    icon: LinkIcon,
    title: "Obfuscated Phishing Links",
    technique: "Domain Cloaking",
    body: "Fake GCash or Maya portals, raw IP addresses, or lookalike banking domains designed to harvest e-wallet credentials.",
    advice: "Check the exact domain. Authentic Philippine banks and e-wallets do not use bit.ly or raw domains.",
  },
  {
    icon: ClockIcon,
    title: "Manufactured SIM Urgency",
    technique: "SIM Deactivation Threats",
    body: "Advisories claiming your SIM card, GCash, or Maya account will be blocked within 24 hours to panic you into acting.",
    advice: "Telcos and banks will never mandate immediate unverified link clicks to preserve your SIM registration.",
  },
  {
    icon: GiftIcon,
    title: "Ayuda & Task Bait",
    technique: "Incentive Exploitation",
    body: "Claims of unsolicited Ayuda subsidies, Lazada/Shopee part-time task jobs, or lottery payouts requiring processing fees.",
    advice: "Unsolicited cash bonuses, subsidies, or high-paying easy tasks via SMS are scams.",
  },
];

export function ThreatSignals() {
  return (
    <section
      id="signals"
      className="mt-20 scroll-mt-28 border-t-2 border-ink pt-12 sm:mt-24"
    >
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-xl">
          <h2 className="font-display text-[clamp(28px,4.5vw,42px)] font-bold leading-tight tracking-[-0.03em] text-ink">
            Common threat patterns
          </h2>
        </div>
        <p className="max-w-xs text-xs leading-relaxed text-muted-foreground sm:text-sm text-pretty">
          Three primary signal categories the classifier checks for in every message.
        </p>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        {SIGNALS.map(({ icon: Icon, title, technique, body, advice }) => (
          <article
            key={title}
            className="group relative flex flex-col justify-between rounded-xl border-2 border-ink bg-card p-6 shadow-[5px_5px_0_0_#121410] transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-[7px_7px_0_0_#ff5c1a]"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="grid size-11 place-items-center rounded-lg border-2 border-ink bg-paper text-ink shadow-[2px_2px_0_0_#121410] transition-all duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-ink group-hover:shadow-[0_0_20px_2px_rgba(255,92,26,0.55)]">
                  <Icon className="size-5 transition-transform duration-300 group-hover:scale-110" />
                </span>
                <span className="rounded-full border border-ink/15 bg-paper px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase transition-colors duration-300 group-hover:border-primary/40 group-hover:text-primary">
                  {technique}
                </span>
              </div>
              <h3 className="mt-4 font-display text-lg font-bold tracking-tight text-ink transition-colors duration-300 group-hover:text-primary">
                {title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                {body}
              </p>
            </div>
            <div className="mt-5 border-t border-ink/10 pt-3 text-xs font-semibold text-accent transition-colors duration-300 group-hover:border-primary/20">
              <span className="text-primary">Guidance: </span>
              <span className="text-ink/80">{advice}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

