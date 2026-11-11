"use client";

import { useEffect, useRef, useState } from "react";

export type RadarBlip = {
  id: string;
  label: string;
  text: string;
  distance: number; // 0 to 1
  angle: number; // radians
  isSpam: boolean;
  confidence: number;
};

const DEFAULT_BLIPS: RadarBlip[] = [
  {
    id: "blip-1",
    label: "Fake Bank Alert",
    text: "URGENT: Your bank account has been suspended. Verify immediately at https://secure-bank-login.xyz",
    distance: 0.65,
    angle: 0.8,
    isSpam: true,
    confidence: 99,
  },
  {
    id: "blip-2",
    label: "Gift Card Bait",
    text: "Congratulations! You have won a $1,000 gift card. Claim now at http://bit.ly/claim",
    distance: 0.42,
    angle: 2.5,
    isSpam: true,
    confidence: 98,
  },
  {
    id: "blip-3",
    label: "Unpaid Parcel Fee",
    text: "USPS: Your parcel is held due to $2.99 unpaid customs fee. Confirm address at parcel-tracker.net",
    distance: 0.82,
    angle: 4.6,
    isSpam: true,
    confidence: 97,
  },
  {
    id: "blip-4",
    label: "Safe Chat",
    text: "Hey, are we still meeting for lunch tomorrow at noon? Let me know if you need a ride.",
    distance: 0.32,
    angle: 3.4,
    isSpam: false,
    confidence: 99,
  },
];

export function TacticalRadar({
  onSelectMessage,
}: {
  onSelectMessage?: (text: string) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activeBlip, setActiveBlip] = useState<RadarBlip | null>(DEFAULT_BLIPS[0]);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let animationFrameId: number;
    let sweepAngle = 0;
    const blips = [...DEFAULT_BLIPS];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(centerX, centerY) - 16;

      ctx.clearRect(0, 0, width, height);

      // Deep void background
      ctx.fillStyle = "#080a08";
      ctx.fillRect(0, 0, width, height);

      // Subtle range rings
      const rings = [0.25, 0.5, 0.75, 1];
      rings.forEach((rRatio) => {
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * rRatio, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(243, 239, 228, 0.08)";
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Crosshairs
      ctx.beginPath();
      ctx.moveTo(centerX - radius, centerY);
      ctx.lineTo(centerX + radius, centerY);
      ctx.moveTo(centerX, centerY - radius);
      ctx.lineTo(centerX, centerY + radius);
      ctx.strokeStyle = "rgba(243, 239, 228, 0.06)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Range labels in clean natural font
      ctx.fillStyle = "rgba(243, 239, 228, 0.35)";
      ctx.font = "10px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("25%", centerX, centerY - radius * 0.25 + 12);
      ctx.fillText("50%", centerX, centerY - radius * 0.5 + 12);
      ctx.fillText("75%", centerX, centerY - radius * 0.75 + 12);
      ctx.fillText("100%", centerX, centerY - radius + 12);

      // Draw Sweep Cone
      if (!reducedMotion) {
        sweepAngle = (sweepAngle + 0.02) % (Math.PI * 2);

        const sweepArc = 0.5; // arc length of the beam fade
        const gradient = ctx.createRadialGradient(
          centerX,
          centerY,
          0,
          centerX,
          centerY,
          radius
        );
        gradient.addColorStop(0, "rgba(255, 92, 26, 0.2)");
        gradient.addColorStop(1, "rgba(255, 92, 26, 0.02)");

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, sweepAngle - sweepArc, sweepAngle, false);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();

        // Beam Leading Line
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
          centerX + Math.cos(sweepAngle) * radius,
          centerY + Math.sin(sweepAngle) * radius
        );
        ctx.strokeStyle = "rgba(255, 92, 26, 0.85)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();
      }

      // Render Detected Blips
      blips.forEach((blip) => {
        const blipX = centerX + Math.cos(blip.angle) * (radius * blip.distance);
        const blipY = centerY + Math.sin(blip.angle) * (radius * blip.distance);

        // Calculate proximity to sweep beam for phosphor pulse
        const angleDiff = ((sweepAngle - blip.angle) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
        const isNearSweep = angleDiff < 0.6;

        const isCurrent = activeBlip?.id === blip.id;
        const color = blip.isSpam ? "255, 92, 26" : "18, 122, 73";

        // Outer glow
        ctx.beginPath();
        ctx.arc(blipX, blipY, isCurrent ? 14 : isNearSweep ? 10 : 6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, ${isCurrent ? 0.35 : isNearSweep ? 0.25 : 0.08})`;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(blipX, blipY, isCurrent ? 4.5 : 3, 0, Math.PI * 2);
        ctx.fillStyle = isCurrent
          ? "#fff"
          : isNearSweep
          ? `rgb(${color})`
          : `rgba(${color}, 0.7)`;
        ctx.fill();

        // Blip text label
        ctx.fillStyle = isCurrent ? "#fff" : "rgba(243, 239, 228, 0.6)";
        ctx.font = isCurrent ? "bold 11px sans-serif" : "10px sans-serif";
        ctx.textAlign = blipX > centerX ? "left" : "right";
        const labelOffset = blipX > centerX ? 10 : -10;
        ctx.fillText(blip.label, blipX + labelOffset, blipY + 3);
      });

      if (!reducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [activeBlip]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const radius = Math.min(centerX, centerY) - 16;

    // Find closest blip within click radius
    let closest: RadarBlip | null = null;
    let minDist = 36; // 36px hit radius

    DEFAULT_BLIPS.forEach((blip) => {
      const blipX = centerX + Math.cos(blip.angle) * (radius * blip.distance);
      const blipY = centerY + Math.sin(blip.angle) * (radius * blip.distance);
      const dist = Math.hypot(blipX - x, blipY - y);
      if (dist < minDist) {
        minDist = dist;
        closest = blip;
      }
    });

    if (closest) {
      setActiveBlip(closest);
    }
  };

  return (
    <div className="relative flex flex-col overflow-hidden rounded-2xl border-2 border-paper/15 bg-[#080a08] text-paper shadow-[0_24px_70px_-20px_rgba(0,0,0,0.9)]">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-paper/10 bg-paper/[0.02] px-4 py-3 text-xs text-paper/70">
        <div className="flex items-center gap-2">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-primary" />
          </span>
          <span className="font-semibold text-paper">Tactical Radar Interceptor</span>
        </div>
        <span className="text-[11px] text-paper/40">360° frequency scan</span>
      </div>

      {/* Main Canvas Viewport */}
      <div className="relative h-[280px] w-full sm:h-[320px]">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          className="size-full cursor-pointer"
        />

        {/* Hover Hint */}
        <div
          className={`pointer-events-none absolute bottom-3 left-4 text-[11px] text-paper/40 transition-opacity ${
            isHovering ? "opacity-100" : "opacity-0"
          }`}
        >
          Click any target blip to inspect details
        </div>
      </div>

      {/* Active Blip Detail Card */}
      {activeBlip && (
        <div className="border-t border-paper/10 bg-paper/[0.03] p-4 transition-colors">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`size-2 rounded-full ${
                    activeBlip.isSpam ? "bg-primary" : "bg-success"
                  }`}
                />
                <h4 className="font-semibold text-sm text-paper">{activeBlip.label}</h4>
                <span
                  className={`rounded px-1.5 py-0.2 text-[10px] font-medium ${
                    activeBlip.isSpam
                      ? "bg-primary/20 text-primary border border-primary/30"
                      : "bg-success/20 text-[#6fd39b] border border-success/30"
                  }`}
                >
                  {activeBlip.isSpam ? "Spam detected" : "Clean"} · {activeBlip.confidence}%
                </span>
              </div>
              <p className="mt-1.5 line-clamp-2 text-xs text-paper/75 leading-relaxed">
                &ldquo;{activeBlip.text}&rdquo;
              </p>
            </div>

            {onSelectMessage && (
              <button
                type="button"
                onClick={() => onSelectMessage(activeBlip.text)}
                className="shrink-0 rounded-lg border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary hover:text-ink active:scale-95"
              >
                Test in scanner
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
