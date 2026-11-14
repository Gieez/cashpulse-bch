"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  ShieldCheck,
  Zap,
  Code2,
  Cpu,
  Layers,
  Terminal,
  Server,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Copy,
  Check,
} from "lucide-react";

export default function DocsPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const codeSnippets = {
    subscribe: `// 1. Establish direct SSL WebSocket to Fulcrum Electrum node
const ws = new WebSocket("wss://bch.imaginary.cash:50004");

// 2. Handshake protocol version
ws.onopen = () => {
  ws.send(JSON.stringify({
    id: 1,
    method: "server.version",
    params: ["CashPulseClient", ["1.4", "1.6"]]
  }));

  // 3. Subscribe to merchant CashAddr for instant mempool events
  ws.send(JSON.stringify({
    id: 2,
    method: "blockchain.address.subscribe",
    params: ["bitcoincash:qprdydg8545fxwf92cak8yzwh354748eegux45x954"]
  }));
};

// 4. Handle sub-second zero-conf notification
ws.onmessage = (event) => {
  const response = JSON.parse(event.data);
  if (response.method === "blockchain.address.subscribe") {
    const [address, txHash] = response.params;
    console.log(\`Zero-conf transaction verified: \${txHash}\`);
    // Release physical goods or trigger webhook
  }
};`,
    bip21: `import { encodeCashAddress, decodeCashAddress } from "@bitauth/libauth";

// Construct standard BIP-21 URI for Bitcoin Cash checkout
export function buildBip21Invoice(address: string, amountBch: number, memo: string) {
  const cleanAddr = address.replace(/^bitcoincash:/, "");
  const params = new URLSearchParams();
  
  if (amountBch > 0) {
    params.set("amount", amountBch.toFixed(8));
  }
  if (memo) {
    params.set("message", memo);
  }

  return \`bitcoincash:\${cleanAddr}?\${params.toString()}\`;
}`,
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#08090D] text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="border-b border-slate-800 pb-8 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[#00E599] text-xs font-medium mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Technical Reference</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            CashPulse Protocol & Zero-Conf Specification
          </h1>
          <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-3xl leading-relaxed">
            Detailed technical breakdown of decentralized Fulcrum WebSocket telemetry, Double-Spend Proof (DSPROOF) verification, and non-custodial merchant settlement.
          </p>
        </div>

        {/* 4-Card Bento Grid Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-[#00E599] flex items-center justify-center mb-3">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white text-sm mb-1">Sub-Second Latency</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              P2P mempool propagation detected in 180ms to 420ms without polling serverless backends.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white text-sm mb-1">DSPROOF Verification</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Cryptographic conflict notifications broadcast across full nodes prevent double spending.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3">
              <Server className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white text-sm mb-1">Decentralized WSS</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Direct SSL connection to global Fulcrum 2.1.4 Electrum nodes without API keys or rate limits.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white text-sm mb-1">Libauth Native</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Zero-polyfill ESM Bitcoin Cash cryptography handling CashAddr and BIP-21 URI formatting.
            </p>
          </div>
        </div>

        {/* Section 1: Architecture Breakdown */}
        <section className="mb-14 space-y-6">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#00E599]" />
            <h2 className="text-xl font-bold text-white">1. Settlement Architecture</h2>
          </div>

          <div className="p-6 rounded-2xl bg-[#0E121B] border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto">
            <pre>{`[Customer Wallet (Paytaca / Zapit / Cashonize)]
      │
      │ 1. Scans BIP-21 QR Invoice & signs ECDSA/Schnorr inputs
      ▼
[Bitcoin Cash P2P Network (Mempool Broadcast)]
      │
      │ 2. Mempool propagation across worldwide miners (< 300ms)
      ▼
[Decentralized Fulcrum Electrum Node (Fulcrum 2.1.4 over WSS)]
      │   - wss://bch.imaginary.cash:50004 (Mainnet)
      │   - wss://chipnet.imaginary.cash:50004 (Chipnet)
      │
      │ 3. Pushes JSON-RPC notification: blockchain.address.subscribe
      ▼
[CashPulse Next.js Browser Client]
      │
      ├── Verified: DSProof clean & unspent input confirmed
      ├── Sub-second Web Audio harmonic chime feedback
      └── Merchant terminal flips to "SETTLED" status in < 500ms`}</pre>
          </div>
        </section>

        {/* Section 2: Zero-Conf vs 1-Conf Comparison Table */}
        <section className="mb-14 space-y-6">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-sky-400" />
            <h2 className="text-xl font-bold text-white">2. Performance & Latency Matrix</h2>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#0E121B]">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/90 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-4">Settlement Rail</th>
                  <th className="p-4">Latency</th>
                  <th className="p-4">Merchant Fee</th>
                  <th className="p-4">Custody Model</th>
                  <th className="p-4">Double-Spend Protection</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                <tr className="bg-emerald-950/20 font-medium">
                  <td className="p-4 text-emerald-300 flex items-center gap-2 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    CashPulse Zero-Conf (BCH)
                  </td>
                  <td className="p-4 font-mono text-emerald-400 font-bold">&lt; 500 ms</td>
                  <td className="p-4 font-mono text-emerald-400">&lt; $0.001 (0%)</td>
                  <td className="p-4 text-white">Non-Custodial (Self)</td>
                  <td className="p-4 text-emerald-400">DSPROOF Relay Native</td>
                </tr>
                <tr>
                  <td className="p-4 text-slate-300">Bitcoin Core (BTC 1-Conf)</td>
                  <td className="p-4 font-mono text-slate-400">10 to 60 min</td>
                  <td className="p-4 font-mono text-slate-400">$1.50 to $12.00</td>
                  <td className="p-4 text-slate-400">Self-Custody</td>
                  <td className="p-4 text-slate-400">Block PoW Only</td>
                </tr>
                <tr>
                  <td className="p-4 text-slate-300">Ethereum Mainnet (12-Block Finality)</td>
                  <td className="p-4 font-mono text-slate-400">3 to 15 min</td>
                  <td className="p-4 font-mono text-slate-400">$2.00 to $25.00</td>
                  <td className="p-4 text-slate-400">Self-Custody</td>
                  <td className="p-4 text-slate-400">Casper Finality</td>
                </tr>
                <tr>
                  <td className="p-4 text-slate-300">Centralized Gateways (BitPay / Stripe Crypto)</td>
                  <td className="p-4 font-mono text-slate-400">5 to 15 min</td>
                  <td className="p-4 font-mono text-rose-400">1.0% to 2.5% + $0.30</td>
                  <td className="p-4 text-rose-400">Custodial Middleman</td>
                  <td className="p-4 text-slate-400">Centralized Ledger</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 3: WebSocket JSON-RPC Implementation */}
        <section className="mb-14 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-emerald-400" />
              <h2 className="text-xl font-bold text-white">3. Fulcrum WSS Implementation</h2>
            </div>
            <button
              onClick={() => handleCopy(codeSnippets.subscribe, "subscribe")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300"
            >
              {copiedCode === "subscribe" ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#06080C] p-5 overflow-x-auto font-mono text-xs text-emerald-300 leading-relaxed">
            <pre>{codeSnippets.subscribe}</pre>
          </div>
        </section>

        {/* Section 4: Public Fulcrum WebSocket Nodes */}
        <section className="mb-14 space-y-6">
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-bold text-white">4. Verified Public Fulcrum Endpoints</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white text-sm">Mainnet Endpoints</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Port 50004 SSL
                </span>
              </div>
              <ul className="space-y-2 font-mono text-xs text-slate-300">
                <li className="p-2 rounded bg-slate-950/80 border border-slate-800/80">
                  wss://bch.imaginary.cash:50004
                </li>
                <li className="p-2 rounded bg-slate-950/80 border border-slate-800/80">
                  wss://blackie.c3-soft.com:50004
                </li>
                <li className="p-2 rounded bg-slate-950/80 border border-slate-800/80">
                  wss://bch.cyberbits.eu:50004
                </li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white text-sm">Chipnet (Testnet4) Endpoints</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/30">
                  Port 50004 SSL
                </span>
              </div>
              <ul className="space-y-2 font-mono text-xs text-slate-300">
                <li className="p-2 rounded bg-slate-950/80 border border-slate-800/80">
                  wss://chipnet.imaginary.cash:50004
                </li>
                <li className="p-2 rounded bg-slate-950/80 border border-slate-800/80 text-slate-400">
                  tbch.googol.cash (Faucet provider)
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
