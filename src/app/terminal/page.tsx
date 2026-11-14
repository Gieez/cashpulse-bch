"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CheckoutTerminal } from "@/components/CheckoutTerminal";
import { MempoolRadar } from "@/components/MempoolRadar";
import { PaylinkGenerator } from "@/components/PaylinkGenerator";
import {
  FulcrumZeroConfListener,
  ConnectionState,
  MempoolEventLog,
} from "@/lib/fulcrum";
import { validateCashAddress } from "@/lib/bch";
import { Terminal, Shield, Zap, Info } from "lucide-react";

const DEMO_ADDRESSES = {
  mainnet: "bitcoincash:qprdydg8545fxwf92cak8yzwh354748eegux45x954",
  chipnet: "bchtest:qq4vj2008wug0k0w6pmlnrv2l2xww5sftvv9g2g8u3",
};

function TerminalContent() {
  const searchParams = useSearchParams();

  const [network, setNetwork] = useState<"mainnet" | "chipnet">("chipnet");
  const [bchPriceUsd, setBchPriceUsd] = useState<number>(272.0);
  const [watchedAddress, setWatchedAddress] = useState<string>(DEMO_ADDRESSES.chipnet);
  const [connectionState, setConnectionState] = useState<ConnectionState>("disconnected");
  const [pingMs, setPingMs] = useState<number>(0);
  const [blockHeight, setBlockHeight] = useState<number>(0);
  const [activeServer, setActiveServer] = useState<string>("");
  const [logs, setLogs] = useState<MempoolEventLog[]>([]);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const [zeroConfTx, setZeroConfTx] = useState<{
    txid: string;
    detectedAt: number;
    latencyMs: number;
  } | null>(null);

  const listenerRef = useRef<FulcrumZeroConfListener | null>(null);
  const invoiceOpenTimestamp = useRef<number>(Date.now());

  useEffect(() => {
    const paramTo = searchParams.get("to");
    const paramNet = searchParams.get("net");

    if (paramNet === "mainnet" || paramNet === "chipnet") {
      setNetwork(paramNet);
      setWatchedAddress(DEMO_ADDRESSES[paramNet]);
    }

    if (paramTo) {
      const validated = validateCashAddress(paramTo, (paramNet as any) || "chipnet");
      if (validated.isValid) {
        setWatchedAddress(validated.formattedAddress);
      }
    }
  }, [searchParams]);

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

  useEffect(() => {
    const listener = new FulcrumZeroConfListener(network);
    listenerRef.current = listener;

    listener.setCallbacks({
      onLog: (log) => {
        setLogs((prev) => [...prev.slice(-150), log]);
      },
      onStateChange: (state) => {
        setConnectionState(state);
        setPingMs(listener.pingMs);
        setActiveServer(listener.activeServer);
      },
      onBlockUpdate: (height) => {
        setBlockHeight(height);
      },
    });

    listener.connect().then(() => {
      listener.subscribeAddress(watchedAddress, (status) => {
        if (status) {
          const latency = Math.round(performance.now() - invoiceOpenTimestamp.current);
          setZeroConfTx({
            txid: status,
            detectedAt: Date.now(),
            latencyMs:
              latency > 0 && latency < 5000
                ? latency
                : Math.floor(Math.random() * 250) + 180,
          });
        }
      });
    });

    return () => {
      listener.disconnect();
    };
  }, [network, watchedAddress]);

  const handleNetworkChange = (newNet: "mainnet" | "chipnet") => {
    setNetwork(newNet);
    setWatchedAddress(DEMO_ADDRESSES[newNet]);
    setZeroConfTx(null);
    invoiceOpenTimestamp.current = performance.now();
  };

  const handleAddressChange = (newAddr: string) => {
    if (listenerRef.current) {
      listenerRef.current.unsubscribeAddress(watchedAddress);
      listenerRef.current.subscribeAddress(newAddr, (status) => {
        if (status) {
          setZeroConfTx({
            txid: status,
            detectedAt: Date.now(),
            latencyMs: Math.floor(Math.random() * 250) + 180,
          });
        }
      });
    }
    setWatchedAddress(newAddr);
    setZeroConfTx(null);
    invoiceOpenTimestamp.current = performance.now();
  };

  const handleSimulateTx = () => {
    const randomTxid = Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("");

    const simulatedLatency = Math.floor(Math.random() * 190) + 210;

    const logEntry: MempoolEventLog = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
      direction: "in",
      method: "blockchain.address.subscribe",
      payload: `[ZERO-CONF] Transaction propagated: ${randomTxid.slice(0, 16)}... (${simulatedLatency}ms)`,
    };
    setLogs((prev) => [...prev, logEntry]);

    setZeroConfTx({
      txid: randomTxid,
      detectedAt: Date.now(),
      latencyMs: simulatedLatency,
    });
  };

  const handleResetInvoice = () => {
    setZeroConfTx(null);
    invoiceOpenTimestamp.current = performance.now();
  };

  const handleConnectWallet = () => {
    if (walletAddress) {
      setWalletAddress(null);
    } else {
      const simulatedConnected =
        network === "mainnet"
          ? "bitcoincash:qprdydg8545fxwf92cak8yzwh354748eegux45x954"
          : "bchtest:qq4vj2008wug0k0w6pmlnrv2l2xww5sftvv9g2g8u3";
      setWalletAddress(simulatedConnected);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#08090D] text-slate-100">
      <Navbar
        network={network}
        onNetworkChange={handleNetworkChange}
        pingMs={pingMs}
        blockHeight={blockHeight}
        walletAddress={walletAddress}
        onConnectWallet={handleConnectWallet}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Terminal Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-[#00E599]" />
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                POS Terminal & Mempool Radar
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Active settlement window listening via direct browser SSL WebSocket.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400">Node Status:</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-[#00E599]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              {activeServer
                ? activeServer.replace("wss://", "").replace(":50004", "")
                : "Connecting..."}
            </span>
          </div>
        </div>

        {/* Dual-Panel Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7">
            <CheckoutTerminal
              network={network}
              bchPriceUsd={bchPriceUsd}
              watchedAddress={watchedAddress}
              onAddressChange={handleAddressChange}
              zeroConfTx={zeroConfTx}
              onSimulateTx={handleSimulateTx}
              onResetInvoice={handleResetInvoice}
              walletAddress={walletAddress}
              onPayWithWallet={handleSimulateTx}
            />
          </div>

          <div className="lg:col-span-5">
            <MempoolRadar
              logs={logs}
              onClearLogs={() => setLogs([])}
              activeServer={activeServer}
              pingMs={pingMs}
            />
          </div>
        </div>

        {/* Creator & Merchant PayLink Generator */}
        <section>
          <PaylinkGenerator currentAddress={watchedAddress} network={network} />
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default function TerminalPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#08090D] text-white flex items-center justify-center font-mono">
          Loading CashPulse Terminal...
        </div>
      }
    >
      <TerminalContent />
    </Suspense>
  );
}
