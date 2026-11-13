"use client";

import { useEffect, useRef, useState } from "react";

export type RadarBlip = {
  id: string;
  label: string;
  text: string;
  angle: number; // bearing around the radar, radians
  isSpam: boolean;
  confidence: number; // 0-100; also sets distance from center
};

const DEFAULT_BLIPS: RadarBlip[] = [
  {
    id: "blip-1",
    label: "Fake Bank Alert",
    text: "URGENT: Your bank account has been suspended. Verify immediately at https://secure-bank-login.xyz",
    angle: 0.8,
    isSpam: true,
    confidence: 99,
  },
  {
    id: "blip-2",
    label: "Gift Card Bait",
    text: "Congratulations! You have won a $1,000 gift card. Claim now at http://bit.ly/claim",
    angle: 2.5,
    isSpam: true,
    confidence: 98,
  },
  {
    id: "blip-3",
    label: "Unpaid Parcel Fee",
    text: "USPS: Your parcel is held due to $2.99 unpaid customs fee. Confirm address at parcel-tracker.net",
    angle: 4.6,
    isSpam: true,
    confidence: 97,
  },
  {
    id: "blip-4",
    label: "Safe Chat",
    text: "Hey, are we still meeting for lunch tomorrow at noon? Let me know if you need a ride.",
    angle: 3.4,
    isSpam: false,
    confidence: 99,
  },
];

const RADAR_INSET = 16;
const BLIP_LABEL_GAP = 10;
const BLIP_LABEL_MARGIN = 6;

function getRadarGeometry(width: number, height: number) {
  return {
    centerX: width / 2,
    centerY: height / 2,
    radius: Math.max(0, Math.min(width, height) / 2 - RADAR_INSET),
  };
}

function getBlipPosition(
  blip: RadarBlip,
  centerX: number,
  centerY: number,
  radius: number
) {
  const confidence = Math.min(100, Math.max(0, blip.confidence));
  const blipRadius = (radius * confidence) / 100;
  return {
    x: centerX + Math.cos(blip.angle) * blipRadius,
    y: centerY + Math.sin(blip.angle) * blipRadius,
  };
}

export function TacticalRadar({
  onSelectMessage,
}: {
  onSelectMessage?: (text: string) => void;
} = {}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activeBlip, setActiveBlip] = useState<RadarBlip | null>(DEFAULT_BLIPS[0]);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let animationFrameId = 0;
    let sweepAngle = 0;
    let running = false;
    const blips = [...DEFAULT_BLIPS];

    const render = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const { centerX, centerY, radius } = getRadarGeometry(width, height);

      if (width <= 0 || height <= 0 || radius <= 0) return;

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

      // Confidence scale, read outward along the lower half of the vertical axis
      // so the labels stay clear of the blips clustered at the rim.
      ctx.fillStyle = "rgba(243, 239, 228, 0.4)";
      ctx.font = "10px ui-monospace, SFMono-Regular, Menlo, monospace";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      rings.forEach((ratio) => {
        ctx.fillText(`${Math.round(ratio * 100)}%`, centerX + 7, centerY + radius * ratio);
      });
      ctx.textBaseline = "alphabetic";

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
        const { x: blipX, y: blipY } = getBlipPosition(blip, centerX, centerY, radius);

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

        // Blip text label, kept inside the canvas while staying beside its dot
        ctx.fillStyle = isCurrent ? "#fff" : "rgba(243, 239, 228, 0.6)";
        ctx.font = isCurrent ? "bold 11px sans-serif" : "10px sans-serif";
        ctx.textBaseline = "middle";
        const labelWidth = ctx.measureText(blip.label).width;
        let labelX = blipX + (blipX > centerX ? BLIP_LABEL_GAP : -BLIP_LABEL_GAP);
        let labelAlign: CanvasTextAlign = blipX > centerX ? "left" : "right";

        if (labelAlign === "left" && labelX + labelWidth > width - BLIP_LABEL_MARGIN) {
          labelAlign = "right";
          labelX = blipX - BLIP_LABEL_GAP;
        } else if (labelAlign === "right" && labelX - labelWidth < BLIP_LABEL_MARGIN) {
          labelAlign = "left";
          labelX = blipX + BLIP_LABEL_GAP;
        }

        const labelY = Math.min(
          height - BLIP_LABEL_MARGIN,
          Math.max(BLIP_LABEL_MARGIN + 6, blipY)
        );
        ctx.textAlign = labelAlign;
        ctx.fillText(blip.label, labelX, labelY);
        ctx.textBaseline = "alphabetic";
      });
    };

    const loop = () => {
      render();
      animationFrameId = requestAnimationFrame(loop);
    };

    const syncSize = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const visible = width > 32 && height > 32;

      if (reducedMotion) {
        if (visible) render();
        return;
      }

      if (visible && !running) {
        running = true;
        animationFrameId = requestAnimationFrame(loop);
      } else if (!visible && running) {
        running = false;
        cancelAnimationFrame(animationFrameId);
      }
    };

    const observer = new ResizeObserver(syncSize);
    observer.observe(canvas);
    syncSize();

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeBlip]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // The radar panel floats with a CSS scale, so convert pointer coordinates
    // back into the canvas's untransformed layout space before hit-testing.
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.clientWidth > 0 ? rect.width / canvas.clientWidth : 1;
    const scaleY = canvas.clientHeight > 0 ? rect.height / canvas.clientHeight : 1;
    const x = (e.clientX - rect.left) / scaleX;
    const y = (e.clientY - rect.top) / scaleY;

    const { centerX, centerY, radius } = getRadarGeometry(
      canvas.clientWidth,
      canvas.clientHeight
    );

    if (radius <= 0) return;

    // Find closest blip within click radius
    let closest: RadarBlip | null = null;
    let minDist = 36; // 36px hit radius

    DEFAULT_BLIPS.forEach((blip) => {
      const { x: blipX, y: blipY } = getBlipPosition(blip, centerX, centerY, radius);
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
          <span className="size-2 rounded-full bg-primary" />
          <span className="font-semibold text-paper">Tactical Radar Interceptor</span>
        </div>
        <span className="text-[11px] text-paper/50">ring scale · verdict confidence</span>
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
        <div className="border-t border-paper/10 bg-paper/[0.03] p-4 sm:p-5">
          <div className="flex flex-col gap-3">
            {/* Header: Indicator, Target Label, Probability Badge */}
            <div className="flex items-center gap-2.5">
              <span
                className={`size-2 rounded-full ${
                  activeBlip.isSpam ? "bg-primary" : "bg-success"
                }`}
              />
              <h4 className="font-semibold text-sm text-paper tracking-tight">{activeBlip.label}</h4>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide ${
                  activeBlip.isSpam
                    ? "bg-primary/20 text-primary border border-primary/40"
                    : "bg-success/20 text-[#6fd39b] border border-success/40"
                }`}
              >
                {activeBlip.isSpam ? "Spam detected" : "Clean"} · {activeBlip.confidence}%
              </span>
            </div>

            {/* Message Quote Box */}
            <div className="rounded-xl border border-paper/10 bg-black/55 p-3.5 shadow-inner">
              <div className="mb-1.5 text-[11px] font-medium text-paper/40">
                Interception transcript
              </div>
              <p className="text-xs sm:text-[13px] leading-relaxed text-paper/90 italic">
                &ldquo;{activeBlip.text}&rdquo;
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
