"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";

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

const anchorFor = (index: number) => `faq-${index + 1}`;

function indexFromHash(hash: string) {
  const match = /^#faq-(\d+)$/.exec(hash);
  if (!match) return null;
  const index = Number(match[1]) - 1;
  return index >= 0 && index < FAQS.length ? index : null;
}

export function Faq() {
  const [open, setOpen] = useState<number | null>(null);
  const [shown, setShown] = useState(false);
  const baseId = useId();

  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Rows sweep in once the panel scrolls into view.
  useEffect(() => {
    const element = panelRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // Deep links: /#faq-3 opens the third answer and brings it into view.
  useEffect(() => {
    let frame = 0;
    let settle: number | undefined;

    const reveal = (index: number, smooth: boolean) => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      document.getElementById(anchorFor(index))?.scrollIntoView({
        block: "center",
        behavior: smooth && !reduced ? "smooth" : "auto",
      });
    };

    const openFromHash = (initial: boolean) => {
      const index = indexFromHash(window.location.hash);
      if (index === null) return;
      frame = requestAnimationFrame(() => {
        setOpen(index);
        setShown(true);
        reveal(index, !initial);
      });
      // On first load the splash holds the page and fonts are still settling,
      // so centre the answer again once the layout is final.
      if (initial) {
        settle = window.setTimeout(() => reveal(index, true), 2300);
      }
    };

    const onHashChange = () => openFromHash(false);
    openFromHash(true);
    window.addEventListener("hashchange", onHashChange);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(settle);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = FAQS.length - 1;
    const target =
      event.key === "ArrowDown"
        ? index === last
          ? 0
          : index + 1
        : event.key === "ArrowUp"
          ? index === 0
            ? last
            : index - 1
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? last
              : null;

    if (target === null) return;
    event.preventDefault();
    buttonRefs.current[target]?.focus();
  }

  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-28">
      <h2
        id="faq-title"
        className="text-center font-display text-[clamp(28px,4.5vw,42px)] leading-tight font-bold tracking-[-0.03em] text-balance text-ink"
      >
        Frequently asked questions
      </h2>

      <div
        ref={panelRef}
        data-shown={shown}
        data-has-open={open !== null}
        className="faq mx-auto mt-10 max-w-3xl rounded-xl border-2 border-ink bg-card shadow-[8px_8px_0_0_#121410]"
      >
        {FAQS.map((item, index) => {
          const isOpen = open === index;
          const buttonId = `${baseId}-q${index}`;
          const panelId = `${baseId}-a${index}`;

          return (
            <div
              key={item.q}
              id={anchorFor(index)}
              data-open={isOpen}
              style={{ "--i": index } as CSSProperties}
              className="faq-row group relative scroll-mt-32 border-b-2 border-ink/10 bg-card first:rounded-t-[10px] last:rounded-b-[10px] last:border-b-0"
            >
              <h3>
                <button
                  ref={(element) => {
                    buttonRefs.current[index] = element;
                  }}
                  id={buttonId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? null : index)}
                  onKeyDown={(event) => handleKeyDown(event, index)}
                  className="faq-q relative flex w-full items-center justify-between gap-4 rounded-[inherit] px-5 py-4 text-left focus-visible:-outline-offset-4 sm:px-7 sm:py-5"
                >
                  <span className="font-display text-base font-bold tracking-tight text-ink sm:text-lg">
                    {item.q}
                  </span>
                  <span
                    aria-hidden="true"
                    className="faq-toggle grid size-8 shrink-0 place-items-center rounded-md border-2 border-ink bg-paper text-ink"
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
                  <span aria-hidden="true" className="faq-progress" />
                </button>
              </h3>

              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                inert={!isOpen}
                className="faq-panel grid"
              >
                <div className="overflow-hidden">
                  <div className="faq-answer px-5 pt-1 pb-5 sm:px-7 sm:pb-6">
                    <p className="max-w-[62ch] text-[15px] leading-relaxed text-ink/75">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
