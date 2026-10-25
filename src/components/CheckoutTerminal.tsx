"use client";

import React, { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";
import confetti from "canvas-confetti";
import {
  Copy,
  Check,
  ExternalLink,
  Zap,
  Clock,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
  ArrowRight,
} from "lucide-react";
import {
  BCH_NETWORKS,
  validateCashAddress,
  buildBip21Uri,
  playZeroConfSound,
} from "@/lib/bch";

interface CheckoutTerminalProps {
  network: "mainnet" | "chipnet";
  bchPriceUsd: number;
  watchedAddress: string;
  onAddressChange: (newAddr: string) => void;
  zeroConfTx: {
    txid: string;
    detectedAt: number;
    latencyMs: number;
  } | null;
  onSimulateTx: () => void;
  onResetInvoice: () => void;
  walletAddress: string | null;
  onPayWithWallet: () => void;
}

export function CheckoutTerminal({
  network,
  bchPriceUsd,
  watchedAddress,
  onAddressChange,
  zeroConfTx,
  onSimulateTx,
  onResetInvoice,
  walletAddress,
  onPayWithWallet,
}: CheckoutTerminalProps) {
  const [amountBch, setAmountBch] = useState<number>(0.005);
  const [memo, setMemo] = useState<string>("BCH BLAZE 2026 Demo License");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [copiedAddr, setCopiedAddr] = useState<boolean>(false);
  const [copiedUri, setCopiedUri] = useState<boolean>(false);
  const [addressInput, setAddressInput] = useState<string>(watchedAddress);
  const [addressError, setAddressError] = useState<string>("");

  const invoiceCreatedTimeRef = useRef<number>(Date.now());

  // Generate BIP-21 URI
  const bip21Uri = buildBip21Uri({
    address: watchedAddress,
    amountBch,
    label: "CashPulse Merchant",
    message: memo,
  });

  // Re-generate QR Code whenever URI changes
  useEffect(() => {
    let isMounted = true;
    QRCode.toDataURL(bip21Uri, {
      width: 320,
      margin: 1.5,
      color: {
        dark: "#08090D",
        light: "#00E599",
      },
    })
      .then((url) => {
        if (isMounted) setQrDataUrl(url);
      })
      .catch((err) => console.error("QR Code generation error:", err));

    return () => {
      isMounted = false;
    };
  }, [bip21Uri]);

  // Handle zero-conf arrival effects
  useEffect(() => {
    if (zeroConfTx) {
      playZeroConfSound();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#00E599", "#00C2FF", "#FFFFFF"],
        });
      } catch {
        // Confetti fallback
      }
    }
  }, [zeroConfTx]);

  const handleAddressSubmit = () => {
    const check = validateCashAddress(addressInput, network);
    if (!check.isValid) {
      setAddressError(check.error || "Invalid address format");
      return;
    }
    setAddressError("");
    onAddressChange(check.formattedAddress);
  };

  const copyToClipboard = (text: string, type: "addr" | "uri") => {
    navigator.clipboard.writeText(text);
    if (type === "addr") {
      setCopiedAddr(true);
      setTimeout(() => setCopiedAddr(false), 2000);
    } else {
      setCopiedUri(true);
      setTimeout(() => setCopiedUri(false), 2000);
    }
  };

  const usdValue = (amountBch * bchPriceUsd).toFixed(2);
  const explorerUrl = zeroConfTx
    ? BCH_NETWORKS[network].blockExplorerTx(zeroConfTx.txid)
    : "";

  return (
    <div className="flex flex-col gap-5 bg-[#0F1219] border border-[#1E2638] rounded-xl p-5 lg:p-6 shadow-2xl relative overflow-hidden">
      {/* Background technical watermarks */}
      <div className="absolute -top-16 -right-16 w-64 h-64 bg-[#00E599]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-[#00C2FF]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Terminal Title & Invoice Details */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1E2638]">
        <div>
          <span className="text-[11px] font-mono tracking-widest text-[#00C2FF] uppercase font-bold">
            Live Invoice Telemetry
          </span>
          <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2 mt-0.5">
            Instant Zero-Conf POS
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {zeroConfTx ? (
            <button
              onClick={() => {
                invoiceCreatedTimeRef.current = Date.now();
                onResetInvoice();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#151B26] hover:bg-[#1E2638] text-xs font-mono text-gray-200 border border-[#1E2638] transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#00E599]" />
              <span>New Invoice</span>
            </button>
          ) : (
            <button
              onClick={onSimulateTx}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00E599]/10 hover:bg-[#00E599]/20 text-[#00E599] border border-[#00E599]/30 text-xs font-mono font-medium transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Simulate Mempool Hit</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Checkout Grid: QR Code + Payment Info */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* QR Code Presentation Box */}
        <div className="md:col-span-5 flex flex-col items-center">
          <div className="relative p-3 bg-[#08090D] border-2 border-[#1E2638] rounded-2xl group transition-all duration-300 hover:border-[#00E599]/60">
            {/* Visual corner brackets for brutalist terminal feel */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#00E599]" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#00E599]" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#00E599]" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#00E599]" />

            {qrDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qrDataUrl}
                alt="BCH Payment QR"
                className="w-56 h-56 rounded-lg object-contain"
              />
            ) : (
              <div className="w-56 h-56 flex items-center justify-center text-xs font-mono text-gray-500">
                Generating QR...
              </div>
            )}

            {/* Zero-conf success badge overlay */}
            {zeroConfTx && (
              <div className="absolute inset-0 bg-[#08090D]/90 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center p-4 text-center animate-fadeIn">
                <div className="w-12 h-12 rounded-full bg-[#00E599]/20 border border-[#00E599] flex items-center justify-center text-[#00E599] mb-2 animate-pulse-ring">
                  <Zap className="w-6 h-6 fill-current" />
                </div>
                <span className="font-mono text-xs text-[#00E599] uppercase tracking-wider font-bold">
                  Zero-Conf Verified
                </span>
                <span className="font-mono text-[11px] text-gray-300 mt-1">
                  Latency: {zeroConfTx.latencyMs}ms
                </span>
              </div>
            )}
          </div>

          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={() => copyToClipboard(bip21Uri, "uri")}
              className="text-[11px] font-mono text-gray-400 hover:text-white flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#151B26] border border-[#1E2638] transition-colors"
            >
              {copiedUri ? <Check className="w-3 h-3 text-[#00E599]" /> : <Copy className="w-3 h-3" />}
              <span>{copiedUri ? "URI Copied" : "Copy BIP-21 URI"}</span>
            </button>
          </div>
        </div>

        {/* Payment Amount & Receiver Address Form */}
        <div className="md:col-span-7 flex flex-col gap-4">
          {/* Amount Display & Controls */}
          <div className="bg-[#151B26] border border-[#1E2638] rounded-xl p-4">
            <div className="flex items-center justify-between text-xs font-mono text-[#8892B0] mb-1">
              <span>PAYMENT DUE</span>
              <span>1 BCH ≈ ${bchPriceUsd.toLocaleString()} USD</span>
            </div>

            <div className="flex items-baseline justify-between gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.001"
                  min="0.0001"
                  value={amountBch}
                  onChange={(e) => setAmountBch(parseFloat(e.target.value) || 0)}
                  className="font-mono text-2xl lg:text-3xl font-bold text-white bg-transparent outline-none w-36 border-b border-transparent focus:border-[#00E599]"
                />
                <span className="font-mono font-bold text-lg text-[#00E599]">BCH</span>
              </div>

              <div className="text-right">
                <span className="font-mono text-sm text-gray-400">≈ ${usdValue} USD</span>
              </div>
            </div>

            {/* Quick preset buttons */}
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#1E2638]/60">
              <span className="text-[10px] font-mono text-gray-500 uppercase">Presets:</span>
              {[0.001, 0.005, 0.01, 0.05].map((preset) => (
                <button
                  key={preset}
                  onClick={() => setAmountBch(preset)}
                  className={`text-[11px] font-mono px-2 py-0.5 rounded border transition-colors ${
                    amountBch === preset
                      ? "bg-[#00E599]/15 text-[#00E599] border-[#00E599]/40"
                      : "bg-[#0F1219] text-gray-400 border-[#1E2638] hover:text-white"
                  }`}
                >
                  {preset} BCH
                </button>
              ))}
            </div>
          </div>

          {/* Merchant Receiving Address */}
          <div className="bg-[#151B26] border border-[#1E2638] rounded-xl p-3.5">
            <div className="flex items-center justify-between text-xs font-mono text-[#8892B0] mb-1.5">
              <span>DESTINATION CASHADDR</span>
              <button
                onClick={() => copyToClipboard(watchedAddress, "addr")}
                className="hover:text-white flex items-center gap-1 text-[11px]"
              >
                {copiedAddr ? <Check className="w-3 h-3 text-[#00E599]" /> : <Copy className="w-3 h-3" />}
                <span>{copiedAddr ? "Copied" : "Copy"}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={addressInput}
                onChange={(e) => setAddressInput(e.target.value)}
                onBlur={handleAddressSubmit}
                onKeyDown={(e) => e.key === "Enter" && handleAddressSubmit()}
                className="w-full font-mono text-xs text-gray-200 bg-[#0F1219] px-2.5 py-2 rounded-lg border border-[#1E2638] outline-none focus:border-[#00E599] truncate"
              />
            </div>
            {addressError && (
              <p className="text-[11px] font-mono text-[#EF4444] mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {addressError}
              </p>
            )}
          </div>

          {/* Order Memo */}
          <div className="bg-[#151B26] border border-[#1E2638] rounded-xl p-3.5">
            <span className="text-[10px] font-mono text-[#8892B0] uppercase block mb-1">
              Order Description / Memo
            </span>
            <input
              type="text"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              className="w-full font-mono text-xs text-gray-300 bg-[#0F1219] px-2.5 py-1.5 rounded-lg border border-[#1E2638] outline-none focus:border-[#00E599]"
            />
          </div>

          {/* WizardConnect Action */}
          {walletAddress && (
            <button
              onClick={onPayWithWallet}
              className="w-full py-2.5 px-4 rounded-xl bg-[#00E599] hover:bg-[#00c985] text-black font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#00E599]/20"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>PAY {amountBch} BCH VIA CONNECTED WALLET</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Instant Zero-Conf Telemetry Status Card */}
      <div
        className={`mt-2 p-4 rounded-xl border font-mono transition-all duration-300 ${
          zeroConfTx
            ? "bg-[#00E599]/10 border-[#00E599]/40 text-white"
            : "bg-[#08090D] border-[#1E2638] text-gray-300"
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                zeroConfTx
                  ? "bg-[#00E599] text-black"
                  : "bg-[#151B26] text-[#00C2FF] animate-pulse"
              }`}
            >
              {zeroConfTx ? <Zap className="w-5 h-5 fill-current" /> : <Clock className="w-5 h-5" />}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-wide">
                  {zeroConfTx ? "ZERO-CONF TRANSACTION DETECTED" : "AWAITING MEMPOOL BROADCAST"}
                </span>
                {zeroConfTx && (
                  <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-[#00E599]/20 text-[#00E599] border border-[#00E599]/40">
                    Mempool Sub-Second
                  </span>
                )}
              </div>
              <p className="text-xs text-[#8892B0]">
                {zeroConfTx
                  ? `Transaction propagated to Fulcrum node in ${zeroConfTx.latencyMs}ms. Safe for instant merchant release.`
                  : "Listening to live Fulcrum WebSocket stream for broadcasted Bitcoin Cash transactions..."}
              </p>
            </div>
          </div>

          {zeroConfTx && (
            <div className="flex items-center gap-3 self-end sm:self-center">
              <div className="text-right">
                <div className="flex items-center gap-1 text-[11px] text-[#00E599]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>DSProof: Clean</span>
                </div>
                <span className="text-[10px] text-gray-400">0-Conf Safe</span>
              </div>

              {explorerUrl && (
                <a
                  href={explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-[#151B26] hover:bg-[#1E2638] text-[#00E599] border border-[#1E2638] transition-colors"
                  title="View on Block Explorer"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          )}
        </div>

        {zeroConfTx && (
          <div className="mt-3 pt-3 border-t border-[#00E599]/20 flex items-center justify-between text-xs">
            <span className="text-[#8892B0] text-[11px]">TXID:</span>
            <span className="font-mono text-[#00E599] text-[11px] truncate max-w-md">
              {zeroConfTx.txid}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
