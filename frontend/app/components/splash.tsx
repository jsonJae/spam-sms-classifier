"use client";

import { useEffect, useRef, useState } from "react";
import { OverdriveShield } from "./icons";

export function Splash({ onDone }: { onDone: () => void }) {
  const [isExiting, setIsExiting] = useState(false);
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      onDoneRef.current();
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === " ") {
        onDoneRef.current();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 1500);

    const doneTimer = setTimeout(() => {
      onDoneRef.current();
    }, 2050);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  return (
    <div
      data-splash
      className={`fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#080a08] text-paper transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${
        isExiting
          ? "pointer-events-none scale-125 opacity-0 blur-sm"
          : "scale-100 opacity-100 blur-none"
      }`}
      role="status"
      aria-label="Loading"
    >
      {/* Dynamic atmospheric energy glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute size-[560px] rounded-full bg-primary/20 blur-[140px] motion-safe:animate-[pulse-glow_3s_ease-in-out_infinite]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute size-[380px] rounded-full bg-accent/15 blur-[120px] motion-safe:animate-[pulse-glow_4s_ease-in-out_infinite_1s]"
      />

      {/* Cybernetic grid field */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(243,239,228,0.06)_1px,transparent_1px)] [background-size:24px_24px] opacity-75"
      />

      {/* Pure Overdriven Centerpiece Animation */}
      <div className="relative flex items-center justify-center">
        {/* Outermost expanding pulse waves */}
        <div
          aria-hidden="true"
          className="absolute size-72 rounded-full border border-primary/20 motion-safe:animate-[radar-pulse_2.4s_cubic-bezier(0.2,0.8,0.2,1)_infinite]"
        />
        <div
          aria-hidden="true"
          className="absolute size-88 rounded-full border border-primary/10 motion-safe:animate-[radar-pulse_2.4s_cubic-bezier(0.2,0.8,0.2,1)_0.7s_infinite]"
        />

        {/* Counter-rotating reticle rings with precision tick notches */}
        <div
          aria-hidden="true"
          className="absolute size-56 rounded-full border-2 border-dashed border-primary/30 motion-safe:animate-spin-slow"
        />
        <div
          aria-hidden="true"
          className="absolute size-44 rounded-full border border-paper/20 border-t-primary border-b-primary motion-safe:animate-spin-reverse"
        />
        <div
          aria-hidden="true"
          className="absolute size-36 rounded-full border border-primary/40 motion-safe:animate-[pulse-glow_2s_ease-in-out_infinite]"
        />

        {/* Center Illuminated Tactical Shield */}
        <div className="relative z-10 grid size-24 place-items-center rounded-2xl border-2 border-primary bg-[#121410] shadow-[0_0_50px_rgba(255,92,26,0.5),inset_0_0_20px_rgba(255,92,26,0.2)] motion-safe:animate-shield-flare">
          <OverdriveShield className="size-14 text-primary" animated />
        </div>

        {/* Dynamic sweeping beam needle */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute size-56 origin-center motion-safe:animate-radar-sweep-spin"
        >
          <div className="h-1/2 w-0.5 bg-gradient-to-t from-transparent via-primary/60 to-primary shadow-[0_0_12px_#ff5c1a] mx-auto" />
        </div>
      </div>
    </div>
  );
}
