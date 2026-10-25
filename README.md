# CashPulse ⚡
### Sub-Second Bitcoin Cash (BCH) Zero-Conf Payment Terminal & PayLink Forge

> **Built for BCH BLAZE 2026 Hackathon (DoraHacks)**  
> Non-custodial, decentralized point-of-sale terminal verifying Bitcoin Cash payments in under 500ms via direct browser-to-node Fulcrum WebSockets without waiting for block miners.

---

## 🚀 Overview

The biggest UX barrier to cryptocurrency payments in physical retail and digital commerce is settlement latency. Traditional Bitcoin transactions require 10-60 minutes to achieve 1-block finality. 

**Bitcoin Cash solves this natively with unconfirmed (Zero-Conf) transactions and Double-Spend Proofs (DSPROOF).**

**CashPulse** unlocks this potential through a high-frequency financial telemetry terminal built directly in Next.js. Instead of relying on centralized payment processors or middleman APIs (like BitPay or CoinPayments), CashPulse connects directly to decentralized Fulcrum Electrum nodes over secure WebSockets (`wss://`). The exact millisecond a buyer's transaction enters the peer-to-peer mempool, CashPulse verifies and settles the invoice instantly.

---

## ⚡ Key Features

1. **Sub-Second Zero-Conf Telemetry (< 500ms)**
   - Connects to decentralized Fulcrum 2.1+ nodes over browser-native WebSocket.
   - Listens to real-time address activity via `blockchain.address.subscribe`.
   - Fires instant optical and synthesized audio confirmations the microsecond a transaction propagates.

2. **Native BIP-21 QR Code & Invoice Generator**
   - Automatically formats payment requests conforming to the BIP-21 standard (`bitcoincash:<address>?amount=<val>&message=<memo>`).
   - Dynamic real-time BCH/USD exchange rate conversion.
   - Full support for CashAddr prefixes (`bitcoincash:`, `bchtest:`).

3. **Multi-Network Support (Mainnet & Chipnet)**
   - Seamless switching between BCH Mainnet and Chipnet (Testnet4).
   - Dynamic block height telemetry and node ping latency tracker.

4. **WizardConnect & Wallet Compatibility**
   - Compatible with leading Bitcoin Cash wallets: Paytaca, Cashonize, Zapit, and Electron Cash.
   - Embedded WizardConnect interface for direct browser wallet settlement.

5. **Merchant & Creator PayLink Forge**
   - Generate reusable zero-conf checkout URLs (`/?to=...&amount=...&memo=...`) for digital creators, freelance invoices, and tipping links.

---

## 🛠️ Architecture

```text
Buyer / Customer Wallet (Paytaca / Zapit / Cashonize / Electron Cash)
       │
       │  1. Scan BIP-21 QR Code & Broadcast to BCH P2P Network
       ▼
Bitcoin Cash P2P Mempool
       │
       │  2. Mempool Propagation Event (< 500ms)
       ▼
Decentralized Fulcrum Electrum Node (Fulcrum 2.1.4 over WSS)
       │  - wss://bch.imaginary.cash:50004 (Mainnet)
       │  - wss://chipnet.imaginary.cash:50004 (Chipnet)
       │
       │  3. Push Notification: blockchain.address.subscribe
       ▼
CashPulse Next.js Terminal (Client WebSocket Engine)
       │
       ├── ⚡ Zero-Conf Sound Synthesizer (Web Audio API)
       ├── 🎉 Confetti & Visual Emerald Pulse
       └── 🛡️ DSProof Verification Check
```

---

## 📦 Tech Stack

- **Framework**: Next.js 16 (App Router + Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 (Fintech Brutalism Aesthetic)
- **BCH Cryptography**: `@bitauth/libauth` (Pure TypeScript CashAddr & Script encoding)
- **Networking**: Direct Browser WebSocket JSON-RPC 2.0 (Fulcrum Protocol)
- **Wallet Connection**: `@wizardconnect/react` & `@wizardconnect/dapp`
- **Audio Feedback**: Synthesized Web Audio API Oscillators

---

## 🚦 Quickstart

```bash
# Clone the repository
git clone https://github.com/Gieez/cashpulse-bch.git
cd cashpulse-bch

# Install dependencies
npm install

# Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing Zero-Conf Payment

1. Ensure the network selector is set to **Chipnet** or **Mainnet**.
2. Scan the generated QR code with any Bitcoin Cash wallet.
3. Broadcast the transaction.
4. Watch the **Fulcrum WSS Stream Radar** on the right log the real-time JSON-RPC notification and observe the invoice resolve in sub-second latency.
5. *Evaluation Mode*: Click the **"Simulate Mempool Hit"** button to preview the zero-conf audio-visual confirmation loop without needing testnet funds.

---

## 📄 License

MIT License. Built for the **BCH BLAZE 2026 DoraHacks Hackathon**.
