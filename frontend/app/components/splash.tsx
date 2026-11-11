"use client";

import { useEffect, useRef, useState } from "react";
import { OverdriveShield } from "./icons";

const BOOT_SEQUENCE = [
  { step: "1", label: "Calibrating TF-IDF vector matrix", latency: "14ms" },
  { step: "2", label: "Connecting to classification engine", latency: "8ms" },
  { step: "3", label: "Loading heuristic pattern library", latency: "22ms" },
  { step: "4", label: "System ready", latency: "0ms" },
];

export function Splash({ onDone }: { onDone: () => void }) {
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(12);
  const [isExiting, setIsExiting] = useState(false);
  const highWaterRef = useRef(12);
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

    const stepTimers: NodeJS.Timeout[] = [];

    const safeSetProgress = (value: number) => {
      if (value > highWaterRef.current) {
        highWaterRef.current = value;
        setProgress(value);
      }
    };

    const safeSetStep = (step: number) => {
      setActiveStep((prev) => Math.max(prev, step));
    };

    stepTimers.push(
      setTimeout(() => {
        safeSetStep(1);
        safeSetProgress(42);
      }, 500)
    );

    stepTimers.push(
      setTimeout(() => {
        safeSetStep(2);
        safeSetProgress(74);
      }, 1100)
    );

    stepTimers.push(
      setTimeout(() => {
        safeSetStep(3);
        safeSetProgress(100);
      }, 1700)
    );

    stepTimers.push(
      setTimeout(() => {
        setIsExiting(true);
      }, 2300)
    );

    stepTimers.push(
      setTimeout(() => {
        onDoneRef.current();
      }, 2750)
    );

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      stepTimers.forEach(clearTimeout);
    };
  }, []);

  return (
    <div
      data-splash
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-[#080a08] px-6 text-paper transition-all duration-500 ease-out ${
        isExiting ? "pointer-events-none -translate-y-full opacity-0" : "translate-y-0 opacity-100"
      }`}
      role="status"
      aria-label="Initializing SMS Guardian"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 size-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[130px]"
      />

      <div className="relative flex w-full max-w-[420px] flex-col items-center gap-7 text-center">
        <div className="relative grid place-items-center">
          <div
            aria-hidden="true"
            className="absolute size-28 rounded-full border border-primary/25 radar-ring"
          />
          <div
            aria-hidden="true"
            className="absolute size-36 rounded-full border border-primary/15"
            style={{ animation: "radar-pulse 2.2s cubic-bezier(0.2, 0.8, 0.2, 1) 0.6s infinite" }}
          />

          <span className="relative grid size-16 place-items-center rounded-2xl border-2 border-primary/40 bg-ink text-primary shadow-[0_0_30px_rgba(255,92,26,0.35)] transition-transform duration-300 hover:scale-105">
            <OverdriveShield className="size-10" animated />
          </span>
        </div>

        <div className="flex flex-col items-center gap-1.5">
          <h1 className="font-display text-3xl font-bold tracking-tight text-paper sm:text-4xl">
            SMS Guardian
          </h1>
          <div className="flex items-center gap-2 text-xs text-paper/60">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
            <span>Spam classification tool</span>
          </div>
        </div>

        <div className="w-full rounded-xl border border-paper/15 bg-paper/[0.03] p-4 text-left text-xs backdrop-blur-sm">
          <div className="flex flex-col gap-2.5">
            {BOOT_SEQUENCE.map((item, index) => {
              const isDone = index <= activeStep;
              const isCurrent = index === activeStep;

              return (
                <div
                  key={item.step}
                  className={`flex items-center justify-between gap-3 transition-opacity duration-300 ${
                    isDone ? "opacity-100" : "opacity-30"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-primary font-semibold">{item.step}.</span>
                    <span className="truncate text-paper/85">{item.label}</span>
                  </div>
                  <span
                    className={`shrink-0 rounded px-1.5 py-0.5 text-[11px] font-medium ${
                      isDone
                        ? isCurrent
                          ? "bg-primary/20 text-primary border border-primary/30"
                          : "bg-success/20 text-[#6fd39b] border border-success/30"
                        : "text-paper/30"
                    }`}
                  >
                    {isDone ? (isCurrent && index < 3 ? "Checking" : "Ready") : "Pending"}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-paper/10">
            <div className="flex items-center justify-between text-xs text-paper/50 mb-1.5">
              <span>Loading</span>
              <span className="text-primary font-medium">{progress}%</span>
            </div>
            <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-paper/15">
              <div
                className="h-full rounded-full bg-primary relative"
                style={{
                  width: `${progress}%`,
                  transition: "width 500ms cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                <div className="absolute right-0 top-0 bottom-0 w-2 bg-white rounded-full shadow-[0_0_10px_#fff]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onDone}
        className="absolute bottom-6 right-6 inline-flex items-center gap-2 rounded-lg border border-paper/20 bg-paper/[0.04] px-4 py-2 text-xs text-paper/70 backdrop-blur transition hover:border-primary hover:bg-primary/10 hover:text-primary active:scale-95"
      >
        <span>Skip intro</span>
        <kbd className="rounded border border-paper/25 px-1 py-0.5 text-[10px] text-paper/40">Esc</kbd>
      </button>
    </div>
  );
}
