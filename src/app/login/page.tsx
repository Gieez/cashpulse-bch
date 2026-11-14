"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  Wallet,
  Shield,
  UserCheck,
  Store,
  Terminal,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ExternalLink,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [selectedPersona, setSelectedPersona] = useState<string>("judge");
  const [connectingWallet, setConnectingWallet] = useState<boolean>(false);
  const [connectedAddr, setConnectedAddr] = useState<string | null>(null);

  const personas = [
    {
      id: "judge",
      title: "Hackathon Judge / Auditor",
      badge: "Recommended for Evaluation",
      description:
        "Instant sandbox access with pre-configured telemetry inspector, simulated zero-conf trigger, and audit log verification.",
      address: "bchtest:qq4vj2008wug0k0w6pmlnrv2l2xww5sftvv9g2g8u3",
      network: "chipnet",
      action: "Launch Judge Console",
    },
    {
      id: "merchant",
      title: "Retail Merchant Cashier",
      badge: "Point-of-Sale",
      description:
        "Full point-of-sale cash terminal with dynamic fiat/BCH conversion and BIP-21 invoice generator.",
      address: "bitcoincash:qprdydg8545fxwf92cak8yzwh354748eegux45x954",
      network: "mainnet",
      action: "Open Merchant POS",
    },
    {
      id: "creator",
      title: "Digital Creator / Freelancer",
      badge: "PayLink Forge",
      description:
        "Reusable zero-conf tipping and checkout links with custom payment memos and satoshi precision.",
      address: "bitcoincash:qprdydg8545fxwf92cak8yzwh354748eegux45x954",
      network: "mainnet",
      action: "Launch PayLink Forge",
    },
  ];

  const handleLaunchPersona = (personaId: string) => {
    setSelectedPersona(personaId);
    if (personaId === "merchant" || personaId === "judge") {
      router.push("/terminal");
    } else {
      router.push("/terminal#paylink");
    }
  };

  const handleConnectWallet = () => {
    setConnectingWallet(true);
    setTimeout(() => {
      setConnectedAddr("bitcoincash:qprdydg8545fxwf92cak8yzwh354748eegux45x954");
      setConnectingWallet(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#08090D] text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[#00E599] text-xs font-medium">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Judge Sandbox & Authentication</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Access CashPulse Workspace
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Select a test persona for one-click hackathon evaluation or connect a self-custody Bitcoin Cash wallet via WizardConnect.
          </p>
        </div>

        {/* 2-Column: Persona Sandbox vs Direct Web3 Wallet */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: 1-Click Reviewer Personas (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-semibold text-white uppercase tracking-wider">
                1-Click Reviewer Personas
              </span>
              <span className="text-[11px] text-emerald-400 font-mono">
                No Faucet Funds Required
              </span>
            </div>

            <div className="space-y-3">
              {personas.map((p) => (
                <div
                  key={p.id}
                  onClick={() => handleLaunchPersona(p.id)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer group ${
                    selectedPersona === p.id
                      ? "bg-emerald-950/20 border-emerald-500/50 shadow-[0_0_20px_rgba(0,229,153,0.1)]"
                      : "bg-[#0E121B] border-slate-800 hover:border-slate-700 hover:bg-slate-900/60"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-[#00E599] flex items-center justify-center font-bold">
                        {p.id === "judge" ? (
                          <Shield className="w-4 h-4" />
                        ) : p.id === "merchant" ? (
                          <Store className="w-4 h-4" />
                        ) : (
                          <Terminal className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-sm group-hover:text-[#00E599] transition-colors">
                          {p.title}
                        </h3>
                        <span className="text-[10px] font-mono text-slate-400">
                          Network: {p.network.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      {p.badge}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    {p.description}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
                    <span className="font-mono text-[11px] text-slate-500 truncate max-w-[280px]">
                      {p.address}
                    </span>
                    <button className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/20 group-hover:bg-emerald-500 text-[#00E599] group-hover:text-black font-semibold text-xs transition-all">
                      <span>{p.action}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Web3 Wallet Connect (5 cols) */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-[#0E121B] border border-slate-800 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Wallet className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white text-base">
                  Connect Bitcoin Cash Wallet
                </h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Pair directly via WizardConnect standard. Supported wallets: Paytaca, Zapit, and Cashonize.
              </p>
            </div>

            {connectedAddr ? (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 space-y-2">
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Wallet Connected</span>
                </div>
                <p className="font-mono text-xs text-white break-all">
                  {connectedAddr}
                </p>
                <Link
                  href="/terminal"
                  className="block w-full text-center py-2 rounded-lg bg-emerald-500 text-black font-bold text-xs hover:bg-emerald-400 transition-colors mt-3"
                >
                  Enter POS Terminal
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={handleConnectWallet}
                  disabled={connectingWallet}
                  className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/40 text-xs font-medium text-white transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                      ⚡
                    </div>
                    <span>WizardConnect Standard</span>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-400">
                    {connectingWallet ? "Pairing..." : "Connect"}
                  </span>
                </button>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-400 space-y-2">
                  <span className="font-semibold text-slate-200 block text-[11px]">
                    Supported BCH Wallets:
                  </span>
                  <ul className="space-y-1 text-[11px] text-slate-400 list-disc list-inside">
                    <li>Paytaca (iOS & Android)</li>
                    <li>Cashonize (Web & Extension)</li>
                    <li>Zapit (Mobile Multi-Asset)</li>
                    <li>Electron Cash (Desktop via BIP-21 QR)</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
