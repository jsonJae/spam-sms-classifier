"use client";

import { useEffect, useState } from "react";
import { OverdriveShield } from "./icons";

const NAV_LINKS = [
  { href: "#top", label: "About" },
  { href: "#scan", label: "Scanner" },
  { href: "#docs", label: "Docs" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("top");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      const sections = ["top", "scan", "docs"];
      const scrollPosition = window.scrollY + 180;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollPosition) {
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

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex w-full justify-center px-4 pt-3 pb-2 sm:px-6 sm:pt-4 pointer-events-none">
      <header
        className={`pointer-events-auto flex items-center justify-between border-2 border-ink bg-paper/95 backdrop-blur-md transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          scrolled
            ? "h-13 w-full max-w-xl rounded-full px-5 sm:px-6 shadow-[0_4px_16px_-4px_rgba(18,20,16,0.18)]"
            : "h-15 w-full max-w-4xl rounded-xl px-5 sm:px-7 shadow-[0_2px_8px_-2px_rgba(18,20,16,0.12)]"
        }`}
      >
        {/* Brand / Logo */}
        <a
          href="#top"
          className="group flex items-center gap-2.5 transition-transform duration-200 active:scale-95"
        >
          <span
            className={`grid shrink-0 place-items-center rounded-lg border-2 border-ink bg-primary text-ink shadow-[1px_1px_0_0_#121410] transition-all duration-300 group-hover:scale-105 ${
              scrolled ? "size-7.5" : "size-8.5"
            }`}
          >
            <OverdriveShield className={scrolled ? "size-4" : "size-5"} animated />
          </span>
          <span className="font-display text-base font-bold tracking-tight text-ink sm:text-lg">
            SMS Guardian
          </span>
        </a>

        {/* Navigation Sections */}
        <nav aria-label="Page Sections" className="flex items-center gap-1 sm:gap-1.5">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.href.slice(1);
            return (
              <a
                key={link.href}
                href={link.href}
                className={`relative rounded-lg px-3 py-1.5 text-xs font-bold tracking-tight transition-all duration-200 sm:px-4 sm:text-sm ${
                  isActive
                    ? "border-2 border-ink bg-primary text-ink shadow-[1px_1px_0_0_#121410]"
                    : "text-ink/70 hover:bg-ink/5 hover:text-ink active:scale-95"
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>
      </header>
    </div>
  );
}
