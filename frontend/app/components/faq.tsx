"use client";

import { useId, useState } from "react";

const FAQS = [
  {
    q: "Is my message stored anywhere?",
    a: "No. The text is sent to the classifier, scored in memory, and discarded. It is not written to a database, browser storage, or cookies. Your hosting provider may still keep standard request metadata such as timestamps.",
  },
  {
    q: "What does the confidence percentage mean?",
    a: "It is the model's probability for the label it chose. A spam verdict at 92% means the model leans strongly toward spam. It is not calibrated against live SMS traffic, so treat it as a strength of signal rather than a guarantee.",
  },
  {
    q: "Why does a result say borderline?",
    a: "Anything under 60% confidence is marked borderline. The model sees words from both sides and cannot separate them well. Check the sender, the link domain, and whether you expected the message before acting on it.",
  },
  {
    q: "Do the link, urgency, and prize hints change the score?",
    a: "No. Those hints are simple pattern checks that run in your browser to show you what to look for. Only the TF-IDF and logistic regression pipeline produces the verdict.",
  },
  {
    q: "How accurate is it?",
    a: "It scored 0.99 accuracy on a held-out test set of 1,170 messages. That set mixes English ham from the UCI collection with Philippine spam, so real-world accuracy on your messages will be lower. It is a demo-sized classifier, not a security product.",
  },
  {
    q: "Can I use it for Tagalog or Taglish messages?",
    a: "Partly. The spam examples come from Philippine SMS, so common local scam wording is covered. The ham examples are English only, which means a legitimate Tagalog or Taglish message can lean toward spam. Weigh borderline results with extra care.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(null);
  const baseId = useId();

  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="mt-20 scroll-mt-28 border-t-2 border-ink pt-12 sm:mt-24"
    >
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h2
            id="faq-title"
            className="font-display text-[clamp(28px,4.5vw,42px)] font-bold leading-tight tracking-[-0.03em] text-ink"
          >
            Questions, answered
          </h2>
          <p className="mt-3 max-w-[40ch] text-sm leading-relaxed text-muted-foreground text-pretty">
            What the verdict means, what happens to your text, and where the
            model falls short.
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border-2 border-ink bg-card shadow-[5px_5px_0_0_#121410]">
          {FAQS.map((item, index) => {
            const isOpen = open === index;
            const buttonId = `${baseId}-q${index}`;
            const panelId = `${baseId}-a${index}`;

            return (
              <div
                key={item.q}
                data-open={isOpen}
                className="faq-item group border-b-2 border-ink/10 last:border-b-0"
              >
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors duration-200 hover:bg-paper/70 focus-visible:-outline-offset-2 sm:px-6 sm:py-5"
                  >
                    <span className="font-display text-base font-bold tracking-tight text-ink transition-colors duration-200 group-data-[open=true]:text-primary-hover sm:text-lg">
                      {item.q}
                    </span>
                    <span
                      aria-hidden="true"
                      className="grid size-8 shrink-0 place-items-center rounded-md border-2 border-ink bg-paper text-ink transition-[background-color,transform,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-data-[open=true]:rotate-45 group-data-[open=true]:bg-primary group-data-[open=true]:shadow-[2px_2px_0_0_#121410]"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        className="size-4"
                      >
                        <path d="M12 5v14" />
                        <path d="M5 12h14" />
                      </svg>
                    </span>
                  </button>
                </h3>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  inert={!isOpen}
                  className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-[420ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-data-[open=true]:grid-rows-[1fr]"
                >
                  <div className="overflow-hidden">
                    <p className="max-w-[65ch] px-5 pb-5 text-sm leading-relaxed text-muted-foreground opacity-0 blur-[2px] -translate-y-1.5 transition-[opacity,translate,filter] duration-300 ease-out group-data-[open=true]:translate-y-0 group-data-[open=true]:opacity-100 group-data-[open=true]:blur-none group-data-[open=true]:delay-100 sm:px-6 sm:pb-6">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
