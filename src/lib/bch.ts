import { decodeCashAddress, encodeCashAddress } from "@bitauth/libauth";

export const SATS_PER_BCH = 100_000_000;

export interface BchNetworkConfig {
  name: string;
  prefix: "bitcoincash" | "bchtest";
  isTestnet: boolean;
  fulcrumWss: string[];
  blockExplorerTx: (txid: string) => string;
  blockExplorerAddress: (address: string) => string;
}

export const BCH_NETWORKS: Record<"mainnet" | "chipnet", BchNetworkConfig> = {
  mainnet: {
    name: "Mainnet",
    prefix: "bitcoincash",
    isTestnet: false,
    fulcrumWss: [
      "wss://bch.imaginary.cash:50004",
      "wss://blackie.c3-soft.com:50004",
      "wss://bch.cyberbits.eu:50004",
    ],
    blockExplorerTx: (txid: string) => `https://blockchair.com/bitcoin-cash/transaction/${txid}`,
    blockExplorerAddress: (addr: string) => `https://blockchair.com/bitcoin-cash/address/${addr}`,
  },
  chipnet: {
    name: "Chipnet (Testnet)",
    prefix: "bchtest",
    isTestnet: true,
    fulcrumWss: [
      "wss://chipnet.imaginary.cash:50004",
    ],
    blockExplorerTx: (txid: string) => `https://chipnet.chaingraph.cash/tx/${txid}`,
    blockExplorerAddress: (addr: string) => `https://chipnet.chaingraph.cash/address/${addr}`,
  },
};

/**
 * Validates a Bitcoin Cash CashAddr
 */
export function validateCashAddress(address: string, expectedNetwork: "mainnet" | "chipnet" = "mainnet"): {
  isValid: boolean;
  formattedAddress: string;
  error?: string;
} {
  try {
    const cleanAddr = address.trim();
    const targetPrefix = BCH_NETWORKS[expectedNetwork].prefix;
    
    // Add prefix if missing
    const withPrefix = cleanAddr.includes(":") ? cleanAddr : `${targetPrefix}:${cleanAddr}`;
    
    const decoded = decodeCashAddress(withPrefix);
    if (typeof decoded === "string") {
      return { isValid: false, formattedAddress: cleanAddr, error: decoded };
    }

    if (decoded.prefix !== targetPrefix) {
      return { 
        isValid: false, 
        formattedAddress: withPrefix, 
        error: `Expected ${targetPrefix} address, but got ${decoded.prefix}` 
      };
    }

    return { isValid: true, formattedAddress: withPrefix };
  } catch (err) {
    return { 
      isValid: false, 
      formattedAddress: address, 
      error: err instanceof Error ? err.message : "Invalid CashAddress" 
    };
  }
}

/**
 * Builds standard BIP-21 URI for Bitcoin Cash
 */
export function buildBip21Uri(options: {
  address: string;
  amountBch?: number;
  label?: string;
  message?: string;
}): string {
  const { address, amountBch, label, message } = options;
  const urlParams = new URLSearchParams();

  if (amountBch && amountBch > 0) {
    urlParams.set("amount", amountBch.toFixed(8));
  }
  if (label) {
    urlParams.set("label", label);
  }
  if (message) {
    urlParams.set("message", message);
  }

  const queryString = urlParams.toString();
  return `${address}${queryString ? `?${queryString}` : ""}`;
}

/**
 * Web Audio API synthesizer for instant zero-conf feedback chime
 */
export function playZeroConfSound() {
  try {
    if (typeof window === "undefined") return;
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();

    // 1. First high harmonic chime (BCH laser sound)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();

    osc1.type = "sine";
    osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc1.frequency.exponentialRampToValueAtTime(880.0, ctx.currentTime + 0.12); // A5
    osc1.frequency.exponentialRampToValueAtTime(1174.66, ctx.currentTime + 0.25); // D6

    gain1.gain.setValueAtTime(0.18, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);

    osc1.start();
    osc1.stop(ctx.currentTime + 0.5);

    // 2. Sub-bass thump (Satisfying physical confirmation feel)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();

    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(120, ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 0.2);

    gain2.gain.setValueAtTime(0.25, ctx.currentTime);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);

    osc2.start();
    osc2.stop(ctx.currentTime + 0.3);
  } catch {
    // Audio context may be restricted by browser auto-play policy until first user interaction
  }
}
