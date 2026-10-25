"use client";

import React, { useState } from "react";
import { Link2, Copy, Check, Sparkles } from "lucide-react";

interface PaylinkGeneratorProps {
  currentAddress: string;
  network: "mainnet" | "chipnet";
}

export function PaylinkGenerator({ currentAddress, network }: PaylinkGeneratorProps) {
  const [recipient, setRecipient] = useState(currentAddress);
  const [amount, setAmount] = useState<string>("0.01");
  const [description, setDescription] = useState<string>("Digital Support / Freelance");
  const [generatedLink, setGeneratedLink] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  const handleGenerate = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://cashpulse-bch.vercel.app";
    const params = new URLSearchParams();
    if (recipient) params.set("to", recipient);
    if (amount) params.set("amount", amount);
    if (description) params.set("memo", description);
    if (network) params.set("net", network);

    const fullUrl = `${origin}/?${params.toString()}`;
    setGeneratedLink(fullUrl);
  };

  const handleCopy = () => {
    if (!generatedLink) return;
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#111722] border border-slate-800 rounded-2xl p-6 lg:p-7 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Link2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">
              Instant PayLink Forge (Merchants & Creators)
            </h3>
            <p className="text-xs text-slate-400">
              Generate one-click zero-conf payment links for social bios, client invoices, or tipping jars.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mb-4">
        <div>
          <label className="text-xs text-slate-300 font-medium block mb-1.5">Your BCH CashAddr</label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="bitcoincash:qp..."
            className="w-full text-xs text-slate-200 bg-slate-900/90 px-3 py-2 rounded-xl border border-slate-800 outline-none focus:border-emerald-500 font-mono transition-colors"
          />
        </div>

        <div>
          <label className="text-xs text-slate-300 font-medium block mb-1.5">Preset Amount (BCH)</label>
          <input
            type="number"
            step="0.001"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.01"
            className="w-full text-xs text-slate-200 bg-slate-900/90 px-3 py-2 rounded-xl border border-slate-800 outline-none focus:border-emerald-500 font-mono transition-colors"
          />
        </div>

        <div>
          <label className="text-xs text-slate-300 font-medium block mb-1.5">Product / Invoice Memo</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Logo Design / Tip Jar"
            className="w-full text-xs text-slate-200 bg-slate-900/90 px-3 py-2 rounded-xl border border-slate-800 outline-none focus:border-emerald-500 transition-colors"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <button
          onClick={handleGenerate}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 hover:border-slate-600 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Generate PayLink</span>
        </button>

        {generatedLink && (
          <div className="flex-1 w-full flex items-center gap-2 bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-xl">
            <span className="text-xs font-mono text-slate-300 truncate flex-1">{generatedLink}</span>
            <button
              onClick={handleCopy}
              className="text-[#00E599] hover:text-white flex items-center gap-1 text-xs font-medium shrink-0 px-2 py-1 rounded bg-slate-800"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied" : "Copy Link"}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
