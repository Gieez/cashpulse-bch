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
  Store,
  ChevronDown,
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
  const [memo, setMemo] = useState<string>("BCH BLAZE Hackathon Demo");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [copiedAddr, setCopiedAddr] = useState<boolean>(false);
  const [copiedUri, setCopiedUri] = useState<boolean>(false);
  const [isEditingAddress, setIsEditingAddress] = useState<boolean>(false);
  const [addressInput, setAddressInput] = useState<string>(watchedAddress);
  const [addressError, setAddressError] = useState<string>("");

  const invoiceCreatedTimeRef = useRef<number>(Date.now());

  const bip21Uri = buildBip21Uri({
    address: watchedAddress,
    amountBch,
    label: "CashPulse Merchant",
    message: memo,
  });

  // Re-generate QR Code
  useEffect(() => {
    let isMounted = true;
    QRCode.toDataURL(bip21Uri, {
      width: 320,
      margin: 2,
      color: {
        dark: "#0F172A",
        light: "#FFFFFF",
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

  // Zero-conf celebration
  useEffect(() => {
    if (zeroConfTx) {
      playZeroConfSound();
      try {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 },
          colors: ["#00E599", "#38BDF8", "#F59E0B"],
        });
      } catch {
        // Confetti fallback
      }
    }
  }, [zeroConfTx]);

  const handleAddressSubmit = () => {
    const check = validateCashAddress(addressInput, network);
    if (!check.isValid) {
      setAddressError(check.error || "Format CashAddr tidak valid");
      return;
    }
    setAddressError("");
    setIsEditingAddress(false);
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
    <div className="bg-[#111722] border border-slate-800 rounded-2xl p-6 lg:p-7 shadow-xl relative overflow-hidden transition-all">
      {/* Soft ambient lighting */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar: Merchant Profile & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400 border border-slate-700">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-white">Merchant Checkout POS</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Non-Custodial
              </span>
            </div>
            <p className="text-xs text-slate-400">Pembayaran langsung ke wallet Anda tanpa perantara</p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          {zeroConfTx ? (
            <button
              onClick={() => {
                invoiceCreatedTimeRef.current = Date.now();
                onResetInvoice();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
              <span>Invoice Baru</span>
            </button>
          ) : (
            <button
              onClick={onSimulateTx}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-[#00E599] border border-emerald-500/30 text-xs font-medium transition-all cursor-pointer bch-glow-sm"
              title="Coba simulasi transaksi zero-conf untuk testing instan"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Simulasi Pembayaran</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: QR View + Interactive Form */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6 items-center">
        {/* Left Column: QR Code Display */}
        <div className="md:col-span-5 flex flex-col items-center">
          <div className="relative p-3.5 bg-white rounded-2xl shadow-xl transition-all duration-300 hover:scale-[1.02] border-4 border-slate-800">
            {qrDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qrDataUrl}
                alt="BCH BIP-21 Invoice QR"
                className="w-52 h-52 rounded-xl object-contain"
              />
            ) : (
              <div className="w-52 h-52 flex items-center justify-center text-xs text-slate-400 font-mono">
                Membuat QR Code...
              </div>
            )}

            {/* Zero-conf overlay when payment detected */}
            {zeroConfTx && (
              <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center p-4 text-center animate-fadeIn">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-[#00E599] mb-2 animate-pulse-ring">
                  <Zap className="w-6 h-6 fill-current" />
                </div>
                <span className="font-semibold text-sm text-[#00E599]">
                  Pembayaran Terdeteksi
                </span>
                <span className="font-mono text-xs text-slate-300 mt-1">
                  Kecepatan: {zeroConfTx.latencyMs} ms
                </span>
              </div>
            )}
          </div>

          <div className="mt-3.5 flex items-center gap-2">
            <button
              onClick={() => copyToClipboard(bip21Uri, "uri")}
              className="text-xs text-slate-300 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-slate-600 transition-colors"
            >
              {copiedUri ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedUri ? "URI Tersalin" : "Salin BIP-21 URI"}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Amount, Address, Order Details */}
        <div className="md:col-span-7 flex flex-col gap-4">
          {/* Amount Box */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
              <span>JUMLAH TAGIHAN</span>
              <span className="font-mono text-slate-300">1 BCH ≈ ${bchPriceUsd.toLocaleString()} USD</span>
            </div>

            <div className="flex items-baseline justify-between gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.001"
                  min="0.0001"
                  value={amountBch}
                  onChange={(e) => setAmountBch(parseFloat(e.target.value) || 0)}
                  className="font-mono text-3xl font-bold text-white bg-transparent outline-none w-36 border-b border-transparent focus:border-emerald-500"
                />
                <span className="font-bold text-xl text-[#00E599]">BCH</span>
              </div>

              <div className="text-right">
                <span className="text-sm font-medium text-slate-300">≈ ${usdValue} USD</span>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-slate-800/80">
              <span className="text-[11px] text-slate-400">Pilihan:</span>
              {[0.001, 0.005, 0.01, 0.05].map((preset) => (
                <button
                  key={preset}
                  onClick={() => setAmountBch(preset)}
                  className={`text-xs font-mono px-2.5 py-1 rounded-lg border transition-all ${
                    amountBch === preset
                      ? "bg-emerald-500/20 text-[#00E599] border-emerald-500/40 font-semibold"
                      : "bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white"
                  }`}
                >
                  {preset} BCH
                </button>
              ))}
            </div>
          </div>

          {/* Destination Address Pill */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
              <span>ALAMAT TUJUAN (CASHADDR)</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEditingAddress(!isEditingAddress)}
                  className="text-xs text-sky-400 hover:underline cursor-pointer"
                >
                  {isEditingAddress ? "Batal" : "Ganti"}
                </button>
                <button
                  onClick={() => copyToClipboard(watchedAddress, "addr")}
                  className="hover:text-white flex items-center gap-1 text-xs text-slate-300"
                >
                  {copiedAddr ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedAddr ? "Tersalin" : "Salin"}</span>
                </button>
              </div>
            </div>

            {isEditingAddress ? (
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="text"
                  value={addressInput}
                  onChange={(e) => setAddressInput(e.target.value)}
                  className="flex-1 font-mono text-xs text-slate-200 bg-slate-950 px-2.5 py-2 rounded-lg border border-slate-700 outline-none focus:border-emerald-500"
                  placeholder="Masukkan CashAddr tujuan..."
                />
                <button
                  onClick={handleAddressSubmit}
                  className="px-3 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold text-xs transition-colors"
                >
                  Simpan
                </button>
              </div>
            ) : (
              <div className="font-mono text-xs text-slate-200 bg-slate-950/60 px-3 py-2 rounded-lg border border-slate-800/90 truncate">
                {watchedAddress}
              </div>
            )}

            {addressError && (
              <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {addressError}
              </p>
            )}
          </div>

          {/* Order Memo */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5">
            <span className="text-xs text-slate-400 block mb-1">Keterangan / Memo Invoice</span>
            <input
              type="text"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              className="w-full text-xs text-slate-200 bg-slate-950/60 px-3 py-2 rounded-lg border border-slate-800/90 outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Pay with Wallet CTA */}
          {walletAddress && (
            <button
              onClick={onPayWithWallet}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-[#00E599] hover:from-emerald-400 hover:to-emerald-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>BAYAR {amountBch} BCH DENGAN WALLET TERHUBUNG</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Real-time Status Card */}
      <div
        className={`mt-6 p-4 rounded-xl border transition-all duration-300 ${
          zeroConfTx
            ? "bg-emerald-500/10 border-emerald-500/30 text-white"
            : "bg-slate-900/70 border-slate-800 text-slate-300"
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                zeroConfTx
                  ? "bg-emerald-500 text-slate-950 font-bold"
                  : "bg-slate-800 text-sky-400 animate-pulse"
              }`}
            >
              {zeroConfTx ? <Zap className="w-5 h-5 fill-current" /> : <Clock className="w-5 h-5" />}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">
                  {zeroConfTx ? "Transaksi Berhasil Terverifikasi (Zero-Conf)" : "Menunggu Pembayaran Masuk..."}
                </span>
                {zeroConfTx && (
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-[#00E599] border border-emerald-500/40">
                    Sub-Second
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {zeroConfTx
                  ? `Transaksi langsung masuk ke node Fulcrum dalam ${zeroConfTx.latencyMs} milidetik. Barang/layanan aman diserahkan.`
                  : "Mendengarkan jaringan peer-to-peer Bitcoin Cash melalui node WebSocket terdesentralisasi..."}
              </p>
            </div>
          </div>

          {zeroConfTx && (
            <div className="flex items-center gap-3 self-end sm:self-center">
              <div className="text-right">
                <div className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>DSProof: Clean</span>
                </div>
                <span className="text-[11px] text-slate-400">Zero-Conf Safe</span>
              </div>

              {explorerUrl && (
                <a
                  href={explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 transition-colors"
                  title="Buka di Block Explorer"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          )}
        </div>

        {zeroConfTx && (
          <div className="mt-3 pt-3 border-t border-emerald-500/20 flex items-center justify-between text-xs">
            <span className="text-slate-400">Transaction ID:</span>
            <span className="font-mono text-emerald-400 text-[11px] truncate max-w-sm sm:max-w-md">
              {zeroConfTx.txid}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
