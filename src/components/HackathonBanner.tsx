"use client";

import React, { useState } from "react";
import { ExternalLink, Copy, Check, Presentation, GitBranch, Flame } from "lucide-react";

interface HackathonBannerProps {
  tokenAddress?: string;
  presentationUrl?: string;
  repoUrl?: string;
}

export function HackathonBanner({
  tokenAddress = "bitcoincash:zprdydg8545fxwf92cak8yzwh354748eegmvx2grtx",
  presentationUrl = "https://docs.google.com/presentation/d/1Yfuk9CJkf4U9M_WukcELhumWgj3Ak6345Ewy8hSp-Hk/edit?usp=sharing",
  repoUrl = "https://github.com/Gieez/cashpulse-bch",
}: HackathonBannerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(tokenAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <aside
      aria-label="BCH BLAZE 2026 Submission Banner"
      className="bg-gradient-to-r from-emerald-950/70 via-slate-900 to-slate-950 border-b border-emerald-500/30 text-xs px-4 sm:px-6 lg:px-8 py-2.5 transition-all text-slate-300"
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-3">
        {/* Left: Hackathon badge & original build flag */}
        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-semibold tracking-wide uppercase text-[10px]">
            <Flame className="w-3 h-3 text-emerald-400 fill-current" />
            BCH BLAZE 2026
          </span>
          <span className="text-[11px] font-medium text-slate-300">
            Official Submission: <span className="text-white font-semibold">CashPulse Terminal</span>
          </span>
          <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700 text-slate-400">
            Original Build (New)
          </span>
        </div>

        {/* Right: Pitch deck link, GitHub repo, and EMBER2026 CashTokens address */}
        <div className="flex flex-wrap items-center justify-center lg:justify-end gap-2 sm:gap-3 text-[11px]">
          {/* Pitch Deck Link */}
          <a
            href={presentationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-slate-700/80 border border-slate-700 text-slate-200 hover:text-white transition-all font-medium"
            title="Open CashPulse Widget Factory Presentation"
          >
            <Presentation className="w-3.5 h-3.5 text-emerald-400" />
            <span>Pitch Deck</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>

          {/* GitHub Source Code */}
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-slate-700/80 border border-slate-700 text-slate-200 hover:text-white transition-all font-medium"
            title="Inspect GitHub Source Repository"
          >
            <GitBranch className="w-3.5 h-3.5 text-slate-300" />
            <span>GitHub</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>

          {/* EMBER2026 Donation Address */}
          <div className="inline-flex items-center gap-1.5 pl-2.5 pr-1 py-0.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30">
            <span className="text-emerald-400 font-semibold text-[10px] tracking-tight">EMBER2026:</span>
            <span
              className="font-mono text-slate-200 text-[10px] max-w-[130px] sm:max-w-[170px] truncate"
              title={tokenAddress}
            >
              {tokenAddress}
            </span>
            <button
              onClick={handleCopy}
              className="inline-flex items-center justify-center p-1 rounded hover:bg-emerald-500/20 text-slate-300 hover:text-white transition-all cursor-pointer"
              title="Copy EMBER2026 CashTokens Address"
              aria-label="Copy CashTokens address"
            >
              {copied ? (
                <Check className="w-3 h-3 text-emerald-400" />
              ) : (
                <Copy className="w-3 h-3 text-slate-400" />
              )}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
