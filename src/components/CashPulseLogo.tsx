"use client";

import React from "react";

interface CashPulseLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  subtext?: string;
}

export function CashPulseLogo({
  size = 36,
  className = "",
  showText = true,
  subtext = "Sub-Second Zero-Conf",
}: CashPulseLogoProps) {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* SVG Icon Mark */}
      <div
        className="relative shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 via-[#0B0E14] to-emerald-950/60 border border-emerald-500/30 shadow-[0_0_15px_rgba(0,229,153,0.15)] group"
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 64 64"
          width={size * 0.75}
          height={size * 0.75}
          fill="none"
          className="transition-transform duration-300 group-hover:scale-105"
        >
          <defs>
            <linearGradient id="logoNeonPulse" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#34D399" />
              <stop offset="50%" stop-color="#00E599" />
              <stop offset="100%" stop-color="#059669" />
            </linearGradient>
            <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Pulse telemetry subtle line */}
          <path
            d="M 6 36 L 16 36 L 22 26 L 28 44 L 34 28 L 40 38 L 46 34 L 58 34"
            stroke="#047857"
            strokeOpacity="0.4"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Lightning Core */}
          <g filter="url(#logoGlow)">
            <path
              d="M 37 10 L 19 33 L 31 33 L 25 54 L 47 27 L 34 27 Z"
              fill="url(#logoNeonPulse)"
            />
            {/* Curved bracket */}
            <path
              d="M 16 20 C 11 25 11 38 16 44"
              stroke="#00E599"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeOpacity="0.9"
            />
            <path
              d="M 48 18 C 52 22 53 30 51 36"
              stroke="#34D399"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeOpacity="0.8"
            />
          </g>

          {/* Instant zero-conf ping dot */}
          <circle cx="50" cy="18" r="2.5" fill="#FFFFFF" />
        </svg>

        {/* Ambient glow effect */}
        <div className="absolute inset-0 rounded-xl bg-emerald-500/10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Typography Brand */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-sans font-bold text-white tracking-tight text-lg leading-none">
              Cash<span className="text-[#00E599]">Pulse</span>
            </span>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-[#00E599] border border-emerald-500/20 font-medium">
              BCH
            </span>
          </div>
          {subtext && (
            <span className="text-[11px] text-slate-400 font-normal leading-tight mt-0.5">
              {subtext}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
