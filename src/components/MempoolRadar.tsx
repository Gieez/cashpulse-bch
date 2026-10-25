"use client";

import React, { useRef, useEffect } from "react";
import { Terminal, Shield, ArrowDownLeft, ArrowUpRight, Trash2, Cpu } from "lucide-react";
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
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div className="flex flex-col h-full bg-[#0F1219] border border-[#1E2638] rounded-xl overflow-hidden shadow-2xl">
      {/* Telemetry Header */}
      <div className="px-4 py-3 bg-[#08090D] border-b border-[#1E2638] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#00C2FF]" />
          <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
            Fulcrum WSS Stream Radar
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#00C2FF]/10 text-[#00C2FF] border border-[#00C2FF]/30">
            LIVE JSON-RPC
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onClearLogs}
            className="p-1 rounded text-gray-500 hover:text-gray-300 transition-colors"
            title="Clear Stream"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Network & Protocol Status Line */}
      <div className="px-4 py-2 bg-[#151B26]/60 border-b border-[#1E2638] flex items-center justify-between text-[11px] font-mono text-[#8892B0]">
        <div className="flex items-center gap-2">
          <Cpu className="w-3 h-3 text-[#00E599]" />
          <span>Protocol: Electrum 1.4 / Fulcrum 2.1</span>
        </div>
        <div>
          <span>Packets: {logs.length}</span>
        </div>
      </div>

      {/* Stream Output Window */}
      <div className="flex-1 p-3 overflow-y-auto font-mono text-xs space-y-2 bg-[#08090D] max-h-[460px] min-h-[320px]">
        {logs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-600 gap-2 py-12">
            <Shield className="w-6 h-6 animate-pulse" />
            <span className="text-[11px]">Connecting to decentralized Fulcrum node...</span>
          </div>
        ) : (
          logs.map((log) => {
            const timeStr = new Date(log.timestamp).toLocaleTimeString();
            const isIn = log.direction === "in";

            return (
              <div
                key={log.id}
                className="group flex items-start gap-2 text-[11px] leading-relaxed border-l-2 pl-2 transition-colors py-0.5"
                style={{
                  borderColor: isIn ? (log.payload.includes("PULSE") ? "#00E599" : "#00C2FF") : "#F59E0B",
                }}
              >
                <span className="text-gray-600 select-none text-[10px] min-w-[55px]">{timeStr}</span>
                <span
                  className={`flex items-center gap-0.5 font-bold uppercase text-[10px] min-w-[28px] ${
                    isIn ? "text-[#00C2FF]" : "text-[#F59E0B]"
                  }`}
                >
                  {isIn ? <ArrowDownLeft className="w-2.5 h-2.5" /> : <ArrowUpRight className="w-2.5 h-2.5" />}
                  {log.direction}
                </span>

                <div className="flex-1 break-all">
                  {log.method && (
                    <span className="text-[#00E599] font-semibold mr-1.5">[{log.method}]</span>
                  )}
                  <span
                    className={
                      log.payload.includes("ZERO-CONF PULSE")
                        ? "text-[#00E599] font-bold bg-[#00E599]/10 px-1 rounded"
                        : "text-gray-300"
                    }
                  >
                    {log.payload}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={terminalEndRef} />
      </div>

      {/* Footer Benchmark Bar */}
      <div className="px-4 py-2 bg-[#08090D] border-t border-[#1E2638] flex items-center justify-between text-[10px] font-mono text-gray-400">
        <span>DSPROOF-READY: YES</span>
        <span className="text-[#00E599]">P2P MEMPOOL BROADCAST: ACTIVE</span>
      </div>
    </div>
  );
}
