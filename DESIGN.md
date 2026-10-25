# Design Direction - CashPulse

## Project
CashPulse — Bitcoin Cash (BCH) Zero-Conf Payment Gateway & Sub-Second Checkout Terminal.

## Purpose
Provide instant, non-custodial merchant payment links, live BIP-21 invoice generation, and real-time sub-second mempool transaction validation via decentralized Fulcrum WebSocket nodes without waiting 10 minutes for block confirmations.

## Audience
Web3 merchants, freelance digital creators, crypto-native buyers, and DoraHacks BCH Blaze hackathon evaluators.

## Brand Character
Precise, sovereign, electric, ultra-low latency, mission-critical, unbloated.

## Visual Concept
High-frequency financial telemetry terminal. The interface breathes with live WebSocket pings, live block clocks, and instantaneous emerald pulse waves the exact microsecond a transaction enters the decentralized mempool.

## Art Direction
Technical Fintech Brutalism with dark-room telemetry aesthetic. Sharp structural containment, crisp mono-spaced data grids, high-contrast status badges, zero frivolous decorations.

## Typography
- Primary UI: System Sans / Geist / Inter fallback (`font-sans`)
- Telemetry & Financial Values: Space Mono / JetBrains Mono / UI Monospace (`font-mono`)
- Hierarchy:
  - Display: 28px - 36px, bold, tracking-tight, mono-tabular
  - Section Headers: 13px - 14px, uppercase, tracking-wider, text-muted-foreground
  - Data / Amounts: Tabular numerals, high contrast emerald/white
  - Micro-labels: 10px - 11px, mono, uppercase, muted

## Color System
- Void Background: `#08090D` (deep pitch dark, eliminates OLED glare)
- Surface / Elevation 1: `#0F1219` (terminal card surface)
- Surface Elevation 2: `#151B26` (interactive elements, inputs)
- Structural Borders: `#1E2638` (hairline technical containment)
- Primary Accent (BCH CashPulse Green): `#00E599` (vivid laser emerald, indicates zero-conf detected & broadcasted)
- Secondary Accent (Fulcrum WSS Cyan): `#00C2FF` (real-time stream active)
- Warning / Mempool Unconfirmed: `#F59E0B` (mempool waiting state)
- Destructive / Dropped: `#EF4444` (double-spend attempt or dropped tx)
- Text Primary: `#F3F4F6`
- Text Muted: `#8892B0`

## Composition & Layout
- Top Telemetry Bar: Live Fulcrum WSS node ping latency, current BCH block height, network selector (Mainnet / Chipnet).
- Split View Desktop / Stacked Mobile:
  - Left Panel: Live Checkout Terminal (BIP-21 QR Code, CashAddr with copy-to-clipboard, countdown timer, dynamic amount in BCH + USD).
  - Right Panel: Real-Time Sub-Second Mempool Log (Decentralized Fulcrum WebSocket event stream with raw JSON inspect, zero-conf latency benchmark counter).
- Floating Tipping Widget / Modal mode for plug-and-play merchant embeds.

## Motion & Interaction
- WebSocket connection ping indicator: subtle continuous breathing beacon (GPU opacity transform).
- Zero-Conf Detection Event: Instant high-velocity emerald ring pulse expanding across the payment card, accompanied by crisp audio feedback (`cash-register` / `sub-bass hit`) and confetti burst.
- Respect `prefers-reduced-motion` across all transition loops.

## Forbidden Patterns
- No generic purple/violet AI gradients.
- No floating 3D glassmorphic spheres or blurry gradient blobs.
- No generic SaaS testimonial carousels or fake review grids.
- No em-dashes as bullet points or lazy separators.
- No unstyled raw text without technical hierarchy.
