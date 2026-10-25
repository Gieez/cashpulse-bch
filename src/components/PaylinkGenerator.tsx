"use client";

import React, { useState } from "react";
import { Link2, Copy, Check, Share2, Sparkles } from "lucide-react";
import { validateCashAddress } from "@/lib/bch";

interface PaylinkGeneratorProps {
  currentAddress: string;
  network: "mainnet" | "chipnet";
}

export function PaylinkGenerator({ currentAddress, network }: PaylinkGeneratorProps) {
  const [recipient, setRecipient] = useState(currentAddress);
  const [amount, setAmount] = useState<string>("0.01");
  const [description, setDescription] = useState<string>("Digital Service Support");
  const [generatedLink, setGeneratedLink] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  const handleGenerate = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://cashpulse.vercel.app";
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
    <div className="bg-[#0F1219] border border-[#1E2638] rounded-xl p-5 shadow-xl font-mono">
      <div className="flex items-center gap-2 mb-3">
        <Link2 className="w-4 h-4 text-[#00E599]" />
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Merchant & Creator PayLink Forge
        </h3>
      </div>
      <p className="text-xs text-[#8892B0] mb-4">
        Generate reusable zero-conf checkout links for invoices, tipping jars, or social bios.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
        <div>
          <label className="text-[10px] text-gray-400 uppercase block mb-1">Your BCH CashAddr</label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="bitcoincash:qp..."
            className="w-full text-xs text-white bg-[#08090D] px-2.5 py-1.5 rounded-lg border border-[#1E2638] outline-none focus:border-[#00E599]"
          />
        </div>

        <div>
          <label className="text-[10px] text-gray-400 uppercase block mb-1">Amount (BCH)</label>
          <input
            type="number"
            step="0.001"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.01"
            className="w-full text-xs text-white bg-[#08090D] px-2.5 py-1.5 rounded-lg border border-[#1E2638] outline-none focus:border-[#00E599]"
          />
        </div>

        <div>
          <label className="text-[10px] text-gray-400 uppercase block mb-1">Description / Memo</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Freelance Design / Tip"
            className="w-full text-xs text-white bg-[#08090D] px-2.5 py-1.5 rounded-lg border border-[#1E2638] outline-none focus:border-[#00E599]"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <button
          onClick={handleGenerate}
          className="w-full sm:w-auto px-4 py-2 rounded-lg bg-[#151B26] hover:bg-[#1E2638] text-white border border-[#1E2638] hover:border-[#00E599]/40 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#00E599]" />
          <span>Generate PayLink</span>
        </button>

        {generatedLink && (
          <div className="flex-1 w-full flex items-center gap-2 bg-[#08090D] border border-[#1E2638] px-3 py-1.5 rounded-lg">
            <span className="text-[11px] text-gray-300 truncate flex-1">{generatedLink}</span>
            <button
              onClick={handleCopy}
              className="text-[#00E599] hover:text-white flex items-center gap-1 text-[11px] shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
