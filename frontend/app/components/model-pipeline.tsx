"use client";

import { PipelineTrace, type LastScan } from "./pipeline-trace";
import { TrainingFlow } from "./training-flow";

export function ModelPipeline({ lastScan }: { lastScan: LastScan | null }) {
  return (
    <section id="pipeline" aria-labelledby="pipeline-title" className="scroll-mt-28">
      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-14">
        <h2
          id="pipeline-title"
          className="font-display text-[clamp(28px,4.5vw,42px)] leading-tight font-bold tracking-[-0.03em] text-ink"
        >
          How the model decides
        </h2>
        <p className="max-w-[60ch] text-sm leading-relaxed text-muted-foreground text-pretty sm:text-base">
          Pick a message and watch it move through the same four steps the API
          runs. Tokens are computed in your browser with the model&apos;s own
          rules; the score comes from the live model.
        </p>
      </div>

      <div className="mt-10">
        <PipelineTrace lastScan={lastScan} />
      </div>

      <TrainingFlow />
    </section>
  );
}
