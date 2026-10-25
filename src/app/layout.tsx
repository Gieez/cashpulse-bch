import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CashPulse | Sub-Second BCH Zero-Conf Checkout Terminal",
  description:
    "Decentralized, non-custodial Bitcoin Cash zero-conf payment gateway and BIP-21 invoice generator with live Fulcrum WebSocket telemetry. Built for BCH BLAZE 2026.",
  keywords: [
    "Bitcoin Cash",
    "BCH",
    "Zero-Conf",
    "Mempool",
    "Fulcrum",
    "Electrum",
    "BIP-21",
    "CashAddr",
    "Web3 Payment",
    "DoraHacks",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#08090D] text-[#F3F4F6]">{children}</body>
    </html>
  );
}
