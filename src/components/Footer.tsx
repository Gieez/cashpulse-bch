"use client";

import React from "react";
import Link from "next/link";
import { CashPulseLogo } from "@/components/CashPulseLogo";
import { GitBranch, ExternalLink, ShieldCheck, Zap, Globe, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-[#06080C] text-xs text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        {/* Col 1: Identity & Mission */}
        <div className="md:col-span-1 space-y-3">
          <CashPulseLogo size={32} subtext="Zero-Conf Telemetry Terminal" />
          <p className="text-slate-400 leading-relaxed text-[11px]">
            Sub-second non-custodial Bitcoin Cash point-of-sale terminal verifying transactions in under 500ms via decentralized Fulcrum WebSockets.
          </p>
          <div className="flex items-center gap-2 pt-1 text-[11px] text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Double-Spend Proof (DSPROOF) Native</span>
          </div>
        </div>

        {/* Col 2: Navigation */}
        <div className="space-y-2.5">
          <span className="font-semibold text-white tracking-wide uppercase text-[10px] block">
            Navigation
          </span>
          <ul className="space-y-1.5 text-[11px]">
            <li>
              <Link href="/" className="hover:text-emerald-400 transition-colors">
                Overview & Architecture
              </Link>
            </li>
            <li>
              <Link href="/terminal" className="hover:text-emerald-400 transition-colors">
                Interactive POS Terminal
              </Link>
            </li>
            <li>
              <Link href="/analytics" className="hover:text-emerald-400 transition-colors">
                Mempool Traction & Benchmarks
              </Link>
            </li>
            <li>
              <Link href="/docs" className="hover:text-emerald-400 transition-colors">
                Technical Specification
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-emerald-400 transition-colors">
                Judge & Reviewer Persona
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Ecosystem & Standards */}
        <div className="space-y-2.5">
          <span className="font-semibold text-white tracking-wide uppercase text-[10px] block">
            Ecosystem Standards
          </span>
          <ul className="space-y-1.5 text-[11px]">
            <li>
              <a
                href="https://libauth.org"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-400 transition-colors inline-flex items-center gap-1"
              >
                <span>@bitauth/libauth Pure ESM</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
            </li>
            <li>
              <a
                href="https://github.com/cculianu/Fulcrum"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-400 transition-colors inline-flex items-center gap-1"
              >
                <span>Fulcrum 2.1.4 Electrum SPV</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
            </li>
            <li>
              <a
                href="https://cashtokens.org"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-400 transition-colors inline-flex items-center gap-1"
              >
                <span>CashTokens (CHIP-2022-02)</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
            </li>
            <li>
              <a
                href="https://bchblaze.cash"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-400 transition-colors inline-flex items-center gap-1"
              >
                <span>BCH BLAZE 2026 Portal</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
            </li>
          </ul>
        </div>

        {/* Col 4: Hackathon Attribution */}
        <div className="space-y-2.5">
          <span className="font-semibold text-white tracking-wide uppercase text-[10px] block">
            Hackathon Verification
          </span>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] space-y-2">
            <span className="text-white font-medium block">
              DoraHacks BCH BLAZE 2026
            </span>
            <p className="text-slate-400 text-[10px] leading-relaxed">
              Mainnet Track & Media Track submission. Built by Gieez (@Gieez__).
            </p>
            <div className="pt-1 border-t border-slate-800 flex items-center justify-between text-[10px]">
              <span className="text-emerald-400 font-mono">100% Original Build</span>
              <a
                href="https://github.com/Gieez/cashpulse-bch"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-white underline inline-flex items-center gap-1"
              >
                <span>GitHub</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
        <div>
          <span>CashPulse Protocol © 2026. Released under the MIT License.</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-1 text-slate-400">
            <Globe className="w-3 h-3 text-emerald-400" />
            <span>Decentralized Client-Side Architecture</span>
          </span>
          <span className="text-slate-400">No Custodial Gateways</span>
        </div>
      </div>
    </footer>
  );
}
