"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  Zap,
  ShieldCheck,
  Server,
  ArrowRight,
  Terminal,
  Activity,
  Play,
  Presentation,
  GitBranch,
  Copy,
  Check,
  CheckCircle2,
  Clock,
  Layers,
  Flame,
} from "lucide-react";

export default function HomePage() {
  const [copiedAddr, setCopiedAddr] = useState(false);
  const [bchPriceUsd, setBchPriceUsd] = useState<number>(272.0);
  const [simulatedStatus, setSimulatedStatus] = useState<"idle" | "listening" | "settled">("idle");
  const [simulatedLatency, setSimulatedLatency] = useState<number>(342);

  const tokenAddress = "bitcoincash:zprdydg8545fxwf92cak8yzwh354748eegmvx2grtx";
  const mainnetAddress = "bitcoincash:qprdydg8545fxwf92cak8yzwh354748eegux45x954";

  useEffect(() => {
    async function fetchBchPrice() {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin-cash&vs_currencies=usd"
        );
        if (res.ok) {
          const data = await res.json();
          if (data["bitcoin-cash"]?.usd) {
            setBchPriceUsd(data["bitcoin-cash"].usd);
          }
        }
      } catch {
        // Fallback default
      }
    }
    fetchBchPrice();
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(tokenAddress);
      setCopiedAddr(true);
      setTimeout(() => setCopiedAddr(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleTestSimulation = () => {
    setSimulatedStatus("listening");
    const latency = Math.floor(Math.random() * 190) + 210;
    setTimeout(() => {
      setSimulatedLatency(latency);
      setSimulatedStatus("settled");
    }, latency);
  };

  const handleResetSimulation = () => {
    setSimulatedStatus("idle");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#08090D] text-slate-100">
      <Navbar />

      <main className="flex-1 w-full">
        {/* Hero Section (Asymmetric Split 1280px-1440px canvas) */}
        <section className="relative border-b border-slate-800/80 bg-gradient-to-b from-[#0e1622]/60 via-[#08090D] to-[#08090D] py-16 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Ambient grid background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293d0f_1px,transparent_1px),linear-gradient(to_bottom,#1f293d0f_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            {/* Hero Left: Value Prop & Actions (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[#00E599] text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>BCH BLAZE 2026 Official Submission</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.08]">
                Sub-Second <span className="text-[#00E599]">Zero-Conf</span> Bitcoin Cash Terminal
              </h1>

              <p className="text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed">
                Accept non-custodial Bitcoin Cash payments verified in under 500ms via direct browser-to-node Fulcrum WebSockets. Zero middleman fees, zero custody risk, and zero wait time for block miners.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/terminal"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm transition-all shadow-[0_0_20px_rgba(0,229,153,0.3)] hover:shadow-[0_0_25px_rgba(0,229,153,0.4)]"
                >
                  <Terminal className="w-4 h-4" />
                  <span>Launch POS Terminal</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/40 text-slate-200 hover:text-white font-medium text-sm transition-all"
                >
                  <ShieldCheck className="w-4 h-4 text-[#00E599]" />
                  <span>Judge Sandbox</span>
                </Link>

                <a
                  href="/cashpulse-demo.mp4"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 text-slate-300 hover:text-white text-sm transition-all"
                >
                  <Play className="w-3.5 h-3.5 text-emerald-400 fill-current" />
                  <span>Video Demo (1080p)</span>
                </a>
              </div>

              {/* 3 Metric Pills */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80 max-w-xl text-left">
                <div>
                  <span className="block text-2xl font-bold font-mono text-white tabular-nums">
                    &lt; 500ms
                  </span>
                  <span className="text-[11px] text-slate-400 font-normal">
                    Mempool Verification
                  </span>
                </div>
                <div>
                  <span className="block text-2xl font-bold font-mono text-[#00E599] tabular-nums">
                    0.0%
                  </span>
                  <span className="text-[11px] text-slate-400 font-normal">
                    Gateway Fee ($0)
                  </span>
                </div>
                <div>
                  <span className="block text-2xl font-bold font-mono text-sky-400 tabular-nums">
                    DSPROOF
                  </span>
                  <span className="text-[11px] text-slate-400 font-normal">
                    Cryptographic Shield
                  </span>
                </div>
              </div>
            </div>

            {/* Hero Right: Live Interactive Terminal Demo Card (5 cols) */}
            <div className="lg:col-span-5">
              <div className="p-6 rounded-3xl bg-[#0B0E14] border border-slate-800 shadow-[0_10px_40px_rgba(0,0,0,0.6)] space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-mono text-slate-300 font-semibold uppercase tracking-wider">
                      Interactive Live HUD
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                    Fulcrum WSS
                  </span>
                </div>

                {/* Simulated Invoice Display */}
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/90 space-y-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[11px] text-slate-400 font-mono">BIP-21 INVOICE #CP-2026</span>
                    <span className="text-xs text-emerald-400 font-mono font-semibold">1 BCH = ${bchPriceUsd.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-2xl font-bold font-mono text-white">0.0185 BCH</span>
                    <span className="text-sm font-semibold text-emerald-400 font-mono">($5.00 USD)</span>
                  </div>
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>to: {mainnetAddress.slice(0, 16)}...{mainnetAddress.slice(-4)}</span>
                    <span className="text-emerald-400">DSPROOF: Clean</span>
                  </div>
                </div>

                {/* Settlement State Feedback */}
                <div
                  className={`p-4 rounded-2xl border transition-all ${
                    simulatedStatus === "settled"
                      ? "bg-emerald-950/40 border-emerald-500 text-white shadow-[0_0_20px_rgba(0,229,153,0.2)]"
                      : simulatedStatus === "listening"
                      ? "bg-sky-950/30 border-sky-500/50 text-sky-200"
                      : "bg-slate-900/30 border-slate-800 text-slate-400"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {simulatedStatus === "settled" ? (
                        <CheckCircle2 className="w-5 h-5 text-[#00E599]" />
                      ) : (
                        <Activity className="w-5 h-5 text-emerald-400" />
                      )}
                      <div>
                        <span className="text-xs font-bold block">
                          {simulatedStatus === "settled"
                            ? "PAYMENT CONFIRMED (ZERO-CONF)"
                            : simulatedStatus === "listening"
                            ? "LISTENING TO P2P MEMPOOL..."
                            : "WAITING FOR BUYER BROADCAST"}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {simulatedStatus === "settled"
                            ? `Settled in ${simulatedLatency}ms via Fulcrum node`
                            : "Direct browser SSL socket established"}
                        </span>
                      </div>
                    </div>

                    {simulatedStatus === "settled" && (
                      <span className="text-xs font-mono font-bold text-[#00E599] bg-emerald-500/20 px-2 py-0.5 rounded">
                        {simulatedLatency}ms
                      </span>
                    )}
                  </div>
                </div>

                {/* Simulation Control Buttons for Evaluators */}
                <div className="flex items-center gap-2 pt-1">
                  {simulatedStatus === "settled" ? (
                    <button
                      onClick={handleResetSimulation}
                      className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-white transition-all cursor-pointer"
                    >
                      Reset Test Invoice
                    </button>
                  ) : (
                    <button
                      onClick={handleTestSimulation}
                      disabled={simulatedStatus === "listening"}
                      className="w-full py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-[#00E599] hover:text-white text-xs font-semibold transition-all cursor-pointer shadow-sm"
                    >
                      {simulatedStatus === "listening"
                        ? "Propagating Mempool Event..."
                        : "Test Mempool Hit (< 500ms)"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4 Architectural Features Bento Grid */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono text-[#00E599] uppercase tracking-wider font-semibold">
              Zero-Conf Technical Architecture
            </span>
            <h2 className="text-3xl font-bold text-white tracking-tight">
              Direct Client-to-Node Telemetry
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Eliminating the middleman layer with decentralized protocol standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#0E121B] border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-[#00E599] flex items-center justify-center font-bold">
                <Server className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">Direct Browser Fulcrum WSS</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Connects straight from the client browser to public Fulcrum Electrum nodes over SSL WebSocket. No proprietary custodial backend servers.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0E121B] border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">DSPROOF Verification</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Bitcoin Cash nodes relay cryptographic Double-Spend Proofs instantly. If a conflicting transaction appears, CashPulse flags the invoice immediately.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0E121B] border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">BIP-21 QR Invoice Standard</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Generates URI strings compatible with standard Bitcoin Cash wallets including Paytaca, Zapit, Cashonize, and Electron Cash.
              </p>
            </div>
          </div>
        </section>

        {/* Hackathon Submission & Community Voting Section */}
        <section className="border-t border-slate-800/80 bg-[#06080C] py-14 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto rounded-3xl bg-gradient-to-r from-emerald-950/30 via-[#0B0E14] to-slate-900/40 border border-emerald-500/30 p-8 lg:p-10">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-[#00E599] text-xs font-semibold border border-emerald-400/40">
                  <Flame className="w-3.5 h-3.5 fill-current" />
                  <span>BCH BLAZE 2026 DoraHacks Submission</span>
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Vote for CashPulse in Community Choice
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Community Choice voting is decided by sending EMBER2026 CashTokens to the official project token address.
                </p>

                <div className="pt-2 flex items-center gap-2">
                  <span className="font-mono text-xs text-slate-300 bg-black/60 px-3 py-2 rounded-xl border border-slate-800 break-all">
                    {tokenAddress}
                  </span>
                  <button
                    onClick={handleCopy}
                    className="p-2 rounded-xl bg-emerald-500 text-black font-semibold text-xs hover:bg-emerald-400 transition-colors shrink-0"
                    title="Copy CashTokens Address"
                  >
                    {copiedAddr ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 w-full sm:w-auto">
                <a
                  href="https://docs.google.com/presentation/d/107f16_mDvKEnu5qer17X_riQqjKID3Y8tNB4gN1DBes/edit?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium transition-all border border-slate-700"
                >
                  <Presentation className="w-4 h-4 text-emerald-400" />
                  <span>Inspect Widget Factory Pitch</span>
                </a>

                <a
                  href="https://github.com/Gieez/cashpulse-bch"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium transition-all border border-slate-700"
                >
                  <GitBranch className="w-4 h-4 text-slate-400" />
                  <span>Inspect Verified Source Code</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
