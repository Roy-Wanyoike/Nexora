"use client";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden>
        <defs>
          <linearGradient id="nxg" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop stopColor="oklch(0.88 0.18 145)" />
            <stop offset="0.5" stopColor="oklch(0.55 0.13 240)" />
            <stop offset="1" stopColor="oklch(0.78 0.010 220)" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="28" height="28" rx="9" stroke="url(#nxg)" strokeWidth="1.5" opacity="0.55" />
        {/* Nexa "N" mark — two chevrons forming a switch / nexus */}
        <path
          d="M9 23V9.5h2.4l7.2 9.4V9.5H21V23h-2.4l-7.2-9.4V23H9Z"
          fill="url(#nxg)"
        />
        <circle cx="23" cy="9" r="2.2" fill="url(#nxg)" />
      </svg>
      <span className="font-display text-lg font-extrabold tracking-tight">
        Nexa<span className="text-gradient"> Pay</span>
      </span>
    </span>
  );
}
