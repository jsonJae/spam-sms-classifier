type IconProps = {
  className?: string;
};

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.9,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const shieldPath =
  "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z";

export function ShieldMark({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d={shieldPath} />
      <path d="m8.5 12 2.3 2.3L16 9.6" />
    </svg>
  );
}

// Overdriven Multi-Layer Radar Shield Insignia
export function OverdriveShield({ className, animated = false }: IconProps & { animated?: boolean }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      {/* Outer Armor Contour */}
      <path
        d="M26 16c0 6.6-4.6 9.9-10.1 11.8a1.3 1.3 0 0 1-.9 0C9.6 25.9 5 22.6 5 16V7a1.3 1.3 0 0 1 1.3-1.3c2.6 0 5.9-1.6 8.2-3.6a1.5 1.5 0 0 1 2 0c2.3 2 5.6 3.6 8.2 3.6A1.3 1.3 0 0 1 26 7z"
        className="stroke-ink fill-primary"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      {/* Concentric Radar Reticle */}
      <circle cx="15.5" cy="15.5" r="7.5" className="stroke-ink/30" strokeWidth="1.2" strokeDasharray="2 2" />
      <circle cx="15.5" cy="15.5" r="4" className="stroke-ink/40" strokeWidth="1.2" />
      {/* Precision Crosshair */}
      <line x1="15.5" y1="8" x2="15.5" y2="23" className="stroke-ink/40" strokeWidth="1" />
      <line x1="8" y1="15.5" x2="23" y2="15.5" className="stroke-ink/40" strokeWidth="1" />
      {/* Center Radar Beacon */}
      <circle cx="15.5" cy="15.5" r="1.8" className="fill-ink" />
      {/* Animated Sweep Needle */}
      {animated && (
        <line
          x1="15.5"
          y1="15.5"
          x2="21"
          y2="10"
          className="stroke-ink origin-[15.5px_15.5px] animate-spin [animation-duration:3s]"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

export function ShieldAlert({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d={shieldPath} />
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
    </svg>
  );
}

export function ShieldCheck({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d={shieldPath} />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export function ShieldQuestion({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d={shieldPath} />
      <path d="M9.1 9a3 3 0 0 1 5.82 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </svg>
  );
}

export function LinkIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

export function ClockIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export function GiftIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M12 8v13" />
      <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
      <path d="M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 0 1 0 5" />
    </svg>
  );
}

export function TrashIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}

export function GithubIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

export function ArrowUpRight({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M7 17 17 7" />
      <path d="M7 7h10v10" />
    </svg>
  );
}

export function ClipboardIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    </svg>
  );
}

export function CheckIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function RadarIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 12h.01" />
      <path d="M16.24 7.76a6 6 0 1 0 0 8.49" />
      <path d="M19.07 4.93a10 10 0 1 0 0 14.14" />
      <path d="M12 2v10l7 7" />
    </svg>
  );
}

export function SparklesIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3z" />
    </svg>
  );
}

export function RefreshCwIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M3 21v-5h5" />
    </svg>
  );
}
