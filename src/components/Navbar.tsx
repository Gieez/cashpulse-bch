"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CashPulseLogo } from "@/components/CashPulseLogo";
import { HackathonBanner } from "@/components/HackathonBanner";
import { Activity, Wallet, CheckCircle2, Menu, X, ArrowUpRight } from "lucide-react";

interface NavbarProps {
  network?: "mainnet" | "chipnet";
  onNetworkChange?: (net: "mainnet" | "chipnet") => void;
  pingMs?: number;
  blockHeight?: number;
  walletAddress?: string | null;
  onConnectWallet?: () => void;
}

export function Navbar({
  network = "chipnet",
  onNetworkChange,
  pingMs = 184,
  blockHeight = 884210,
  walletAddress = null,
  onConnectWallet,
}: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Overview" },
    { href: "/terminal", label: "POS Terminal", badge: "Live" },
    { href: "/analytics", label: "Traction & Telemetry" },
    { href: "/docs", label: "Technical Spec" },
    { href: "/login", label: "Judge Sandbox" },
  ];

  return (
    <>
      {/* 1. Official BCH BLAZE 2026 Submission Top Banner */}
      <HackathonBanner />

      {/* 2. Main Sticky Navigation Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#08090D]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link href="/" className="hover:opacity-95 transition-opacity">
            <CashPulseLogo size={36} subtext="BCH Zero-Conf Terminal" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800/80">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                    isActive
                      ? "bg-emerald-500/15 text-[#00E599] font-semibold border border-emerald-500/30"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-[#00E599] border border-emerald-500/30">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Controls: Telemetry, Network Switcher & Wallet */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Live Block Height */}
            <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-400 font-mono text-[11px]">
                {blockHeight > 0 ? `#${blockHeight.toLocaleString()}` : "Syncing"}
              </span>
              <span className="text-emerald-400 font-mono text-[10px] bg-emerald-500/10 px-1 py-0.5 rounded">
                {pingMs}ms
              </span>
            </div>

            {/* Network Switcher */}
            {onNetworkChange && (
              <div className="flex items-center rounded-xl bg-slate-900 border border-slate-800 p-1">
                <button
                  onClick={() => onNetworkChange("chipnet")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    network === "chipnet"
                      ? "bg-sky-500/15 text-sky-400 border border-sky-500/30"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Chipnet
                </button>
                <button
                  onClick={() => onNetworkChange("mainnet")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    network === "mainnet"
                      ? "bg-emerald-500/15 text-[#00E599] border border-emerald-500/30"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Mainnet
                </button>
              </div>
            )}

            {/* Connect Wallet / Judge Persona Button */}
            {onConnectWallet ? (
              <button
                onClick={onConnectWallet}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer border ${
                  walletAddress
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                    : "bg-slate-800 hover:bg-slate-700 text-white border-slate-700 hover:border-emerald-500/40"
                }`}
              >
                {walletAddress ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00E599]" />
                ) : (
                  <Wallet className="w-3.5 h-3.5 text-emerald-400" />
                )}
                <span>
                  {walletAddress
                    ? `${walletAddress.slice(0, 8)}...${walletAddress.slice(-4)}`
                    : "Connect Wallet"}
                </span>
              </button>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium bg-emerald-500/15 text-[#00E599] border border-emerald-500/40 hover:bg-emerald-500/25 transition-all"
              >
                <Wallet className="w-3.5 h-3.5" />
                <span>Judge Sandbox</span>
                <ArrowUpRight className="w-3 h-3 opacity-70" />
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-800 bg-[#08090D] px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                  pathname === link.href
                    ? "bg-emerald-500/15 text-[#00E599] border border-emerald-500/30"
                    : "text-slate-300 hover:bg-slate-900"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-xs text-slate-400">Target Network:</span>
              {onNetworkChange && (
                <div className="flex items-center rounded-lg bg-slate-900 border border-slate-800 p-1">
                  <button
                    onClick={() => onNetworkChange("chipnet")}
                    className={`px-2 py-1 rounded text-xs ${
                      network === "chipnet" ? "bg-sky-500/20 text-sky-400" : "text-slate-400"
                    }`}
                  >
                    Chipnet
                  </button>
                  <button
                    onClick={() => onNetworkChange("mainnet")}
                    className={`px-2 py-1 rounded text-xs ${
                      network === "mainnet" ? "bg-emerald-500/20 text-[#00E599]" : "text-slate-400"
                    }`}
                  >
                    Mainnet
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
