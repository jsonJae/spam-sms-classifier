"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { GitHubIcon, OverdriveShield } from "./icons";

const NAV_LINKS = [
  { href: "#top", label: "About" },
  { href: "#scan", label: "Scanner" },
  { href: "#docs", label: "Docs" },
];

type Indicator = {
  x: number;
  width: number;
};

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("top");
  const [menuOpen, setMenuOpen] = useState(false);
  const [indicator, setIndicator] = useState<Indicator>({ x: 0, width: 0 });
  const [indicatorReady, setIndicatorReady] = useState(false);

  const navRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  const measureIndicator = useCallback(() => {
    const nav = navRef.current;
    const activeLink = linkRefs.current[activeSection];
    if (!nav || !activeLink) return;

    const navRect = nav.getBoundingClientRect();
    const linkRect = activeLink.getBoundingClientRect();
    if (linkRect.width === 0) return;

    setIndicator({
      x: linkRect.left - navRect.left,
      width: linkRect.width,
    });
    setIndicatorReady(true);
  }, [activeSection]);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;

      setScrolled((previous) => {
        if (y > 56) return true;
        if (y < 16) return false;
        return previous;
      });

      const sections = ["top", "scan", "docs"];
      const atBottom =
        y + window.innerHeight >= document.documentElement.scrollHeight - 2;

      if (atBottom) {
        setActiveSection(sections[sections.length - 1]);
        return;
      }

      const marker = y + Math.min(160, window.innerHeight * 0.3);

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (!el) continue;

        const sectionTop = el.getBoundingClientRect().top + y;
        if (sectionTop <= marker) {
          setActiveSection(sections[i]);
          return;
        }
      }
      setActiveSection("top");
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    measureIndicator();

    const nav = navRef.current;
    const observer = nav ? new ResizeObserver(measureIndicator) : null;
    if (nav && observer) observer.observe(nav);

    const handleResize = () => measureIndicator();
    window.addEventListener("resize", handleResize);
    document.fonts?.ready.then(measureIndicator).catch(() => {});

    const settle = window.setTimeout(measureIndicator, 600);

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", handleResize);
      window.clearTimeout(settle);
    };
  }, [measureIndicator]);

  useEffect(() => {
    if (!menuOpen) return;

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", handleKey);
    };
  }, [menuOpen]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const handleChange = () => {
      if (desktop.matches) setMenuOpen(false);
    };

    desktop.addEventListener("change", handleChange);
    return () => desktop.removeEventListener("change", handleChange);
  }, []);

  function goToSection(href: string) {
    const target = href.slice(1);
    setMenuOpen(false);
    menuButtonRef.current?.focus({ preventScroll: true });

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document
          .getElementById(target)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-3 pb-2 sm:px-6 sm:pt-4">
      <div className="pointer-events-auto relative w-full max-w-4xl">
        <header
          className={`relative z-50 mx-auto flex w-full items-center justify-between border-2 border-transparent bg-transparent transition-[max-width,height,border-radius,box-shadow,background-color] duration-[560ms] ease-[cubic-bezier(0.22,1,0.36,1)] lg:border-ink lg:bg-paper/95 lg:backdrop-blur-md ${
            scrolled
              ? "h-15 max-w-4xl rounded-xl px-4 shadow-none sm:px-5 lg:h-13 lg:max-w-xl lg:rounded-full lg:px-5 lg:shadow-[0_4px_16px_-4px_rgba(18,20,16,0.18)] lg:duration-[380ms]"
              : "h-15 max-w-4xl rounded-xl px-4 shadow-none sm:px-5 lg:shadow-[0_2px_8px_-2px_rgba(18,20,16,0.12)]"
          }`}
        >
          <a
            href="#top"
            className="group flex shrink-0 items-center gap-2.5 transition-transform duration-200 active:scale-95"
          >
            <span
              className={`grid size-8.5 shrink-0 place-items-center rounded-lg border-2 border-ink bg-primary text-ink shadow-[1px_1px_0_0_#121410] transition-[width,height] duration-[380ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 ${
                scrolled ? "lg:size-7.5" : ""
              }`}
            >
              <OverdriveShield
                className={`size-5 transition-[width,height] duration-[380ms] ${
                  scrolled ? "lg:size-4" : ""
                }`}
                animated
              />
            </span>
            <span className="font-display text-base font-bold tracking-tight text-paper mix-blend-difference sm:text-lg lg:text-ink lg:mix-blend-normal">
              SMS Guardian
            </span>
          </a>

          <nav
            ref={navRef}
            aria-label="Page Sections"
            className="relative hidden items-center gap-1 lg:flex"
          >
            <span
              aria-hidden="true"
              className={`absolute inset-y-0 left-0 rounded-lg border-2 border-ink bg-primary shadow-[1px_1px_0_0_#121410] ${
                indicatorReady
                  ? "transition-[transform,width,opacity] duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                  : ""
              } ${indicator.width > 0 ? "opacity-100" : "opacity-0"}`}
              style={{
                transform: `translateX(${indicator.x}px)`,
                width: `${indicator.width}px`,
              }}
            />

            {NAV_LINKS.map((link) => {
              const section = link.href.slice(1);
              const isActive = activeSection === section;

              return (
                <a
                  key={link.href}
                  ref={(element) => {
                    linkRefs.current[section] = element;
                  }}
                  href={link.href}
                  aria-current={isActive ? "location" : undefined}
                  className={`relative z-10 rounded-lg border-2 border-transparent px-3 py-1.5 text-xs font-bold tracking-tight transition-colors duration-200 sm:px-4 sm:text-sm ${
                    isActive
                      ? "text-ink"
                      : "text-ink/65 hover:bg-ink/5 hover:text-ink"
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            className={`grid size-10 shrink-0 place-items-center rounded-lg border-2 border-ink shadow-[2px_2px_0_0_#121410] transition-[background-color,transform,box-shadow] duration-200 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none lg:hidden ${
              menuOpen ? "bg-primary" : "bg-card"
            }`}
          >
            <span className="relative block h-3.5 w-5" aria-hidden="true">
              <span
                className={`absolute left-0 top-0 h-0.5 w-5 rounded-full bg-ink transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  menuOpen ? "translate-y-[6px] rotate-45" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-1/2 h-0.5 w-5 -translate-y-1/2 rounded-full bg-ink transition-[transform,opacity] duration-200 ${
                  menuOpen ? "scale-x-0 opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute bottom-0 left-0 h-0.5 w-5 rounded-full bg-ink transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  menuOpen ? "-translate-y-[6px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </header>

        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
          aria-hidden={!menuOpen}
          inert={!menuOpen}
          className={`fixed inset-0 z-40 flex flex-col bg-paper transition-[opacity,visibility] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] lg:hidden ${
            menuOpen ? "visible opacity-100" : "invisible opacity-0"
          }`}
        >
          <div className="flex h-full flex-col px-6 pt-28 pb-[calc(2.5rem+env(safe-area-inset-bottom))] sm:px-10 sm:pt-32">
            <nav aria-label="Mobile Page Sections" className="flex flex-col">
              {NAV_LINKS.map((link, index) => {
                const section = link.href.slice(1);
                const isActive = activeSection === section;

                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(event) => {
                      event.preventDefault();
                      goToSection(link.href);
                    }}
                    aria-current={isActive ? "location" : undefined}
                    style={{
                      transitionDelay: menuOpen ? `${120 + index * 70}ms` : "0ms",
                    }}
                    className={`group flex items-center justify-between gap-4 border-b-2 border-ink/10 py-5 transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      menuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                    }`}
                  >
                    <span
                      className={`font-display text-4xl font-bold tracking-tight transition-colors duration-200 sm:text-5xl ${
                        isActive
                          ? "text-primary"
                          : "text-ink group-hover:text-primary"
                      }`}
                    >
                      {link.label}
                    </span>
                    <span className="grid size-9 shrink-0 place-items-center rounded-full border-2 border-ink/15 text-ink/40 transition-all duration-200 group-hover:border-primary group-hover:bg-primary group-hover:text-ink">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                        className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                      >
                        <path d="M5 12h14" />
                        <path d="m13 6 6 6-6 6" />
                      </svg>
                    </span>
                  </a>
                );
              })}
            </nav>

            <div className="mt-auto flex flex-col gap-4 pt-10">
              <a
                href="https://github.com/jsonJae/spam-sms-classifier"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="group flex items-center justify-between gap-3 rounded-xl border-2 border-ink bg-card px-4 py-3.5 text-sm font-bold text-ink shadow-[3px_3px_0_0_#121410] transition-[background-color,box-shadow,transform] duration-200 hover:bg-primary-hover hover:shadow-[5px_5px_0_0_#121410] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              >
                <span className="flex items-center gap-2.5">
                  <GitHubIcon className="size-4" />
                  <span>View on GitHub</span>
                </span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="size-4 text-ink/50 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                >
                  <path d="M7 17 17 7" />
                  <path d="M7 7h10v10" />
                </svg>
              </a>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
                <span>Processed in memory. Nothing is stored.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
