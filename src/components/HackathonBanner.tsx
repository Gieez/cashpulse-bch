"use client";

import React, { useState } from "react";
import { ExternalLink, Copy, Check, Presentation, GitBranch, Flame, Play, Sparkles } from "lucide-react";

interface HackathonBannerProps {
  tokenAddress?: string;
  presentationUrl?: string;
  repoUrl?: string;
  videoUrl?: string;
}

export function HackathonBanner({
  tokenAddress = "bitcoincash:zprdydg8545fxwf92cak8yzwh354748eegmvx2grtx",
  presentationUrl = "https://docs.google.com/presentation/d/107f16_mDvKEnu5qer17X_riQqjKID3Y8tNB4gN1DBes/edit?usp=sharing",
  repoUrl = "https://github.com/Gieez/cashpulse-bch",
  videoUrl = "/cashpulse-demo.mp4",
}: HackathonBannerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(tokenAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback
    }
  };

  return (
    <div
      role="banner"
      aria-label="BCH BLAZE 2026 Official Submission"
      className="relative z-50 w-full border-b border-emerald-500/40 bg-gradient-to-r from-[#031c14] via-[#08151f] to-[#0a101d] px-4 py-3 sm:px-6 lg:px-8 shadow-[0_4px_20px_rgba(0,229,153,0.12)]"
    >
      <div className="max-w-7xl mx-auto flex flex-col xl:flex-row items-center justify-between gap-3 text-xs">
        {/* Left Section: Event Identity & Status */}
        <div className="flex flex-wrap items-center justify-center xl:justify-start gap-2.5 text-center xl:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-[#00E599] font-bold text-[11px] tracking-wider uppercase shadow-[0_0_12px_rgba(0,229,153,0.25)]">
            <Flame className="w-3.5 h-3.5 text-[#00E599] fill-current animate-pulse" />
            <span>BCH BLAZE 2026</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-white text-xs tracking-tight">
              DoraHacks Official BUIDL Submission
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-500/30 text-[10px] font-mono text-emerald-300">
              <Sparkles className="w-3 h-3 text-[#00E599]" />
              Original Build
            </span>
          </div>
        </div>

        {/* Right Section: Core Verification Assets & EMBER2026 Address */}
        <div className="flex flex-wrap items-center justify-center xl:justify-end gap-2 sm:gap-2.5">
          {/* Pitch Deck Link */}
          <a
            href={presentationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-200 hover:text-white transition-all font-medium text-[11px] shadow-sm hover:border-emerald-400"
            title="Open CashPulse Pitch Deck (Widget Factory Template)"
          >
            <Presentation className="w-3.5 h-3.5 text-[#00E599]" />
            <span>Pitch Deck</span>
            <ExternalLink className="w-3 h-3 opacity-70" />
          </a>

          {/* GitHub Repo */}
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-700 hover:border-slate-500 text-slate-200 hover:text-white transition-all font-medium text-[11px]"
            title="Inspect Verified Source Code on GitHub"
          >
            <GitBranch className="w-3.5 h-3.5 text-slate-400" />
            <span>Source Code</span>
            <ExternalLink className="w-3 h-3 opacity-70" />
          </a>

          {/* Video Demo */}
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/40 text-slate-200 hover:text-white transition-all font-medium text-[11px]"
            title="Interactive 1080p Browser Video Demo"
          >
            <Play className="w-3 h-3 text-[#00E599] fill-current" />
            <span>Video Demo</span>
          </a>

          {/* EMBER2026 CashTokens Donation Pill */}
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#061811] border border-emerald-500/50 shadow-inner">
            <span className="text-[#00E599] font-bold text-[10px] tracking-wide">
              EMBER2026:
            </span>
            <span
              className="font-mono text-slate-200 text-[10px] max-w-[140px] sm:max-w-[180px] truncate"
              title={tokenAddress}
            >
              {tokenAddress}
            </span>
            <button
              onClick={handleCopy}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium transition-all cursor-pointer ${
                copied
                  ? "bg-emerald-500 text-black font-semibold"
                  : "bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 hover:text-white border border-emerald-500/30"
              }`}
              title="Copy EMBER2026 CashTokens Address"
              aria-label="Copy CashTokens Address"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 stroke-[3]" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
