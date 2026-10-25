"use client";

import React from "react";
import { Activity, Server, Radio, ShieldCheck, Wallet } from "lucide-react";
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
  const getStatusColor = () => {
    switch (connectionState) {
      case "connected":
        return "text-[#00E599] bg-[#00E599]/10 border-[#00E599]/30";
      case "connecting":
        return "text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/30";
      default:
        return "text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/30";
    }
  };

  return (
    <header className="border-b border-[#1E2638] bg-[#08090D]/90 backdrop-blur-md sticky top-0 z-50 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-[#0F1219] border border-[#1E2638]">
            <span className="font-mono font-black text-[#00E599] text-lg tracking-tighter">B</span>
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E599] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00E599]"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-white tracking-wider text-base">CASHPULSE</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#151B26] text-[#00C2FF] border border-[#1E2638]">
                BCH BLAZE 2026
              </span>
            </div>
            <p className="text-[11px] text-[#8892B0] font-mono">Sub-Second Zero-Conf Checkout Terminal</p>
          </div>
        </div>

        {/* Telemetry Status Gauges */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
          {/* Fulcrum Node Ping */}
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-[#0F1219] border border-[#1E2638]">
            <Server className="w-3.5 h-3.5 text-[#00C2FF]" />
            <span className="text-[#8892B0] hidden sm:inline">Node:</span>
            <span className="text-gray-300 font-medium truncate max-w-[120px]">
              {activeServer ? activeServer.replace("wss://", "").replace(":50004", "") : "Offline"}
            </span>
            <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded border text-[10px] ${getStatusColor()}`}>
              <Radio className="w-2.5 h-2.5" />
              <span>{connectionState === "connected" ? `${pingMs}ms` : connectionState}</span>
            </div>
          </div>

          {/* Block Height */}
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-[#0F1219] border border-[#1E2638]">
            <Activity className="w-3.5 h-3.5 text-[#00E599]" />
            <span className="text-[#8892B0] hidden sm:inline">Block:</span>
            <span className="text-gray-200 font-semibold tabular-nums">
              {blockHeight > 0 ? `#${blockHeight.toLocaleString()}` : "Syncing..."}
            </span>
          </div>

          {/* Network Switcher */}
          <div className="flex items-center rounded-md bg-[#0F1219] border border-[#1E2638] p-0.5">
            <button
              onClick={() => onNetworkChange("chipnet")}
              className={`px-2 py-1 rounded text-[11px] transition-colors ${
                network === "chipnet"
                  ? "bg-[#00C2FF]/15 text-[#00C2FF] font-semibold border border-[#00C2FF]/30"
                  : "text-[#8892B0] hover:text-white"
              }`}
            >
              Chipnet
            </button>
            <button
              onClick={() => onNetworkChange("mainnet")}
              className={`px-2 py-1 rounded text-[11px] transition-colors ${
                network === "mainnet"
                  ? "bg-[#00E599]/15 text-[#00E599] font-semibold border border-[#00E599]/30"
                  : "text-[#8892B0] hover:text-white"
              }`}
            >
              Mainnet
            </button>
          </div>

          {/* WizardConnect Wallet Button */}
          <button
            onClick={onConnectWallet}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#151B26] hover:bg-[#1E2638] text-white border border-[#1E2638] transition-all cursor-pointer hover:border-[#00E599]/40"
          >
            <Wallet className="w-3.5 h-3.5 text-[#00E599]" />
            <span>
              {walletAddress
                ? `${walletAddress.slice(0, 8)}...${walletAddress.slice(-4)}`
                : "WizardConnect"}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
