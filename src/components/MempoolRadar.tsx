"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Terminal,
  Shield,
  ArrowDownLeft,
  ArrowUpRight,
  Trash2,
  Cpu,
  Layers,
  Zap,
  Activity,
  CheckCircle,
} from "lucide-react";
import { MempoolEventLog } from "@/lib/fulcrum";

interface MempoolRadarProps {
  logs: MempoolEventLog[];
  onClearLogs: () => void;
  activeServer: string;
  pingMs: number;
}

export function MempoolRadar({
  logs,
  onClearLogs,
  activeServer,
  pingMs,
}: MempoolRadarProps) {
  const [activeTab, setActiveTab] = useState<"visual" | "raw">("visual");
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeTab === "raw") {
      terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs, activeTab]);

  return (
    <div className="flex flex-col h-full bg-[#111722] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      {/* Header with View Tabs */}
      <div className="px-5 py-3.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold text-white tracking-wide">
            Live Mempool Radar
          </span>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab("visual")}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === "visual"
                ? "bg-emerald-500/15 text-[#00E599] font-semibold border border-emerald-500/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Visual Feed
          </button>
          <button
            onClick={() => setActiveTab("raw")}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === "raw"
                ? "bg-sky-500/15 text-sky-400 font-semibold border border-sky-500/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Raw JSON-RPC
          </button>
        </div>
      </div>

      {/* Visual Mode View */}
      {activeTab === "visual" && (
        <div className="flex-1 p-5 flex flex-col gap-4 bg-[#0B0E14]/40">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-1">Average Latency</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold font-mono text-[#00E599]">
                  {pingMs > 0 ? `${pingMs}ms` : "320ms"}
                </span>
                <span className="text-[10px] text-emerald-400">P2P Instant</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-1">Double-Spend Shield</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold text-white">DSPROOF Active</span>
              </div>
            </div>
          </div>

          {/* Friendly Timeline Feed */}
          <div className="flex-1 flex flex-col">
            <span className="text-xs font-semibold text-slate-300 mb-2.5 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-sky-400" />
              Recent Network Activity
            </span>

            <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[300px] pr-1">
              {logs.slice(-5).reverse().map((log) => {
                const isZeroConf = log.payload.includes("ZERO-CONF");
                const isBlock = log.payload.includes("block");

                return (
                  <div
                    key={log.id}
                    className={`p-3 rounded-xl border transition-all ${
                      isZeroConf
                        ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-300"
                        : "bg-slate-900/60 border-slate-800/90 text-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-semibold flex items-center gap-1">
                        {isZeroConf ? (
                          <>
                            <Zap className="w-3 h-3 text-[#00E599] fill-current" />
                            <span>Zero-Conf Transaction Detected</span>
                          </>
                        ) : isBlock ? (
                          <>
                            <Activity className="w-3 h-3 text-sky-400" />
                            <span>New BCH Block Mined</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-3 h-3 text-slate-400" />
                            <span>Node Stream Synced</span>
                          </>
                        )}
                      </span>
                      <span className="font-mono text-slate-500 text-[10px]">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 truncate font-mono">
                      {log.payload}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Raw JSON-RPC Terminal View */}
      {activeTab === "raw" && (
        <div className="flex-1 flex flex-col bg-slate-950">
          <div className="px-4 py-2 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <div className="flex items-center gap-1.5">
              <Cpu className="w-3 h-3 text-emerald-400" />
              <span>Fulcrum 2.1 WSS Protocol</span>
            </div>
            <button
              onClick={onClearLogs}
              className="hover:text-white flex items-center gap-1 text-[10px]"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear</span>
            </button>
          </div>

          <div className="flex-1 p-3 overflow-y-auto font-mono text-xs space-y-2 max-h-[380px]">
            {logs.map((log) => {
              const timeStr = new Date(log.timestamp).toLocaleTimeString();
              const isIn = log.direction === "in";

              return (
                <div
                  key={log.id}
                  className="group flex items-start gap-2 text-[11px] border-l-2 pl-2 transition-colors py-0.5"
                  style={{
                    borderColor: isIn ? (log.payload.includes("PULSE") ? "#00E599" : "#38BDF8") : "#F59E0B",
                  }}
                >
                  <span className="text-slate-600 select-none text-[10px] min-w-[55px]">{timeStr}</span>
                  <span
                    className={`flex items-center gap-0.5 font-bold uppercase text-[10px] min-w-[28px] ${
                      isIn ? "text-sky-400" : "text-amber-400"
                    }`}
                  >
                    {isIn ? <ArrowDownLeft className="w-2.5 h-2.5" /> : <ArrowUpRight className="w-2.5 h-2.5" />}
                    {log.direction}
                  </span>

                  <div className="flex-1 break-all">
                    {log.method && (
                      <span className="text-[#00E599] font-medium mr-1.5">[{log.method}]</span>
                    )}
                    <span
                      className={
                        log.payload.includes("ZERO-CONF")
                          ? "text-[#00E599] font-semibold"
                          : "text-slate-300"
                      }
                    >
                      {log.payload}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={terminalEndRef} />
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="px-5 py-2.5 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span>Non-Custodial Socket</span>
        </span>
        <span className="text-[11px] font-mono text-emerald-400">Ready for Submissions</span>
      </div>
    </div>
  );
}
