"use client";

import React from "react";
import { Activity, Server, Radio, Wallet, CheckCircle2 } from "lucide-react";
import { ConnectionState } from "@/lib/fulcrum";

interface TelemetryHeaderProps {
  network: "mainnet" | "chipnet";
  onNetworkChange: (net: "mainnet" | "chipnet") => void;
  connectionState: ConnectionState;
  pingMs: number;
  blockHeight: number;
  activeServer: string;
  walletAddress: string | null;
  onConnectWallet: () => void;
}

export function TelemetryHeader({
  network,
  onNetworkChange,
  connectionState,
  pingMs,
  blockHeight,
  activeServer,
  walletAddress,
  onConnectWallet,
}: TelemetryHeaderProps) {
  const isOnline = connectionState === "connected";

  return (
    <header className="border-b border-slate-800/80 bg-[#0B0E14]/80 backdrop-blur-xl sticky top-0 z-50 px-4 sm:px-6 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3.5">
        {/* Brand identity */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-950/40 border border-emerald-500/30 bch-glow-sm">
              <span className="font-mono font-black text-[#00E599] text-xl">⚡</span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-sans font-bold text-white tracking-tight text-lg">CashPulse</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-[#00E599] border border-emerald-500/20 font-medium">
                  BCH BLAZE
                </span>
              </div>
              <p className="text-xs text-slate-400 font-normal">Sub-Second Zero-Conf Checkout</p>
            </div>
          </div>

          {/* Mobile network switcher */}
          <div className="md:hidden flex items-center rounded-lg bg-slate-900 border border-slate-800 p-1">
            <button
              onClick={() => onNetworkChange("chipnet")}
              className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                network === "chipnet" ? "bg-sky-500/20 text-sky-400" : "text-slate-400"
              }`}
            >
              Testnet
            </button>
            <button
              onClick={() => onNetworkChange("mainnet")}
              className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                network === "mainnet" ? "bg-emerald-500/20 text-[#00E599]" : "text-slate-400"
              }`}
            >
              Mainnet
            </button>
          </div>
        </div>

        {/* Telemetry info chips & actions */}
        <div className="flex flex-wrap items-center justify-between md:justify-end gap-2.5 w-full md:w-auto">
          {/* Fulcrum Node Status */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
            <div className="relative flex h-2 w-2">
              {isOnline && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              )}
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  isOnline ? "bg-emerald-400" : "bg-amber-400"
                }`}
              ></span>
            </div>
            <span className="text-slate-400">Fulcrum Node:</span>
            <span className="text-slate-200 font-mono text-[11px] truncate max-w-[130px]">
              {activeServer ? activeServer.replace("wss://", "").replace(":50004", "") : "Reconnecting..."}
            </span>
            {isOnline && (
              <span className="text-emerald-400 font-mono text-[10px] bg-emerald-500/10 px-1.5 py-0.5 rounded">
                {pingMs}ms
              </span>
            )}
          </div>

          {/* Block Height Ticker */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
            <Activity className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400">Block</span>
            <span className="font-mono text-slate-200 font-semibold tabular-nums text-[11px]">
              {blockHeight > 0 ? `#${blockHeight.toLocaleString()}` : "Syncing"}
            </span>
          </div>

          {/* Desktop Network Switcher */}
          <div className="hidden md:flex items-center rounded-xl bg-slate-900/90 border border-slate-800 p-1">
            <button
              onClick={() => onNetworkChange("chipnet")}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                network === "chipnet"
                  ? "bg-sky-500/15 text-sky-400 shadow-sm border border-sky-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Chipnet (Testnet)
            </button>
            <button
              onClick={() => onNetworkChange("mainnet")}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                network === "mainnet"
                  ? "bg-emerald-500/15 text-[#00E599] shadow-sm border border-emerald-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Mainnet
            </button>
          </div>

          {/* WizardConnect Wallet */}
          <button
            onClick={onConnectWallet}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer border ${
              walletAddress
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20"
                : "bg-slate-800 hover:bg-slate-700/80 text-white border-slate-700 hover:border-slate-600"
            }`}
          >
            {walletAddress ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-[#00E599]" />
            ) : (
              <Wallet className="w-3.5 h-3.5 text-emerald-400" />
            )}
            <span>
              {walletAddress
                ? `${walletAddress.slice(0, 8)}...${walletAddress.slice(-4)}`
                : "Connect Wallet"}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
