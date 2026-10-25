import { BCH_NETWORKS } from "./bch";

export interface MempoolEventLog {
  id: string;
  timestamp: number;
  direction: "in" | "out";
  method?: string;
  payload: string;
}

export type ConnectionState = "disconnected" | "connecting" | "connected" | "error";

export class FulcrumZeroConfListener {
  private ws: WebSocket | null = null;
  private network: "mainnet" | "chipnet";
  private currentServerIndex = 0;
  private reqId = 1;
  private pendingCallbacks = new Map<number, (res: unknown) => void>();
  private addressSubscribers = new Map<string, (status: string | null) => void>();
  
  public connectionState: ConnectionState = "disconnected";
  public activeServer = "";
  public currentBlockHeight = 0;
  public pingMs = 0;
  
  private onLogCallback?: (log: MempoolEventLog) => void;
  private onStateChangeCallback?: (state: ConnectionState) => void;
  private onBlockUpdateCallback?: (height: number) => void;

  constructor(network: "mainnet" | "chipnet" = "mainnet") {
    this.network = network;
  }

  public setCallbacks(callbacks: {
    onLog?: (log: MempoolEventLog) => void;
    onStateChange?: (state: ConnectionState) => void;
    onBlockUpdate?: (height: number) => void;
  }) {
    this.onLogCallback = callbacks.onLog;
    this.onStateChangeCallback = callbacks.onStateChange;
    this.onBlockUpdateCallback = callbacks.onBlockUpdate;
  }

  public connect(): Promise<boolean> {
    if (typeof window === "undefined") return Promise.resolve(false);
    
    const servers = BCH_NETWORKS[this.network].fulcrumWss;
    const targetUrl = servers[this.currentServerIndex % servers.length];
    this.activeServer = targetUrl;
    this.updateState("connecting");

    const pingStart = performance.now();

    return new Promise((resolve) => {
      try {
        this.ws = new WebSocket(targetUrl);

        this.ws.onopen = () => {
          this.pingMs = Math.round(performance.now() - pingStart);
          this.updateState("connected");
          this.log("in", `Connected to ${targetUrl} (${this.pingMs}ms)`);

          // 1. Handshake Electrum protocol version
          this.callRpc("server.version", ["CashPulse/1.0", ["1.4", "1.6"]]).then((res) => {
            this.log("in", `Handshake OK: ${JSON.stringify(res)}`);
          });

          // 2. Subscribe to new block headers
          this.callRpc("blockchain.headers.subscribe", []).then((header: any) => {
            if (header && typeof header.height === "number") {
              this.currentBlockHeight = header.height;
              this.onBlockUpdateCallback?.(header.height);
            }
          });

          // 3. Re-subscribe existing watched addresses
          for (const addr of this.addressSubscribers.keys()) {
            this.callRpc("blockchain.address.subscribe", [addr]);
          }

          resolve(true);
        };

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            
            // Check if it is a JSON-RPC response to a previous request
            if (data.id && this.pendingCallbacks.has(data.id)) {
              const cb = this.pendingCallbacks.get(data.id);
              this.pendingCallbacks.delete(data.id);
              cb?.(data.result);
              return;
            }

            // Notification: blockchain.address.subscribe
            if (data.method === "blockchain.address.subscribe" && Array.isArray(data.params)) {
              const [address, status] = data.params;
              this.log("in", `[ZERO-CONF PULSE] Address ${address.slice(0, 18)}... status update: ${status || "empty"}`);
              const sub = this.addressSubscribers.get(address);
              if (sub) {
                sub(status);
              }
            }

            // Notification: blockchain.headers.subscribe
            if (data.method === "blockchain.headers.subscribe" && Array.isArray(data.params)) {
              const header = data.params[0];
              if (header && typeof header.height === "number") {
                this.currentBlockHeight = header.height;
                this.onBlockUpdateCallback?.(header.height);
                this.log("in", `New BCH block detected: #${header.height}`);
              }
            }
          } catch (e) {
            this.log("in", `Parse error: ${event.data}`);
          }
        };

        this.ws.onerror = (err) => {
          this.log("in", `WSS connection error on ${targetUrl}`);
          this.updateState("error");
          resolve(false);
        };

        this.ws.onclose = () => {
          this.updateState("disconnected");
          this.log("in", `WSS connection closed`);
        };
      } catch (err) {
        this.updateState("error");
        resolve(false);
      }
    });
  }

  public subscribeAddress(address: string, onStatusChange: (status: string | null) => void) {
    this.addressSubscribers.set(address, onStatusChange);
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.callRpc("blockchain.address.subscribe", [address]);
    }
  }

  public unsubscribeAddress(address: string) {
    this.addressSubscribers.delete(address);
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.callRpc("blockchain.address.unsubscribe", [address]).catch(() => {});
    }
  }

  public async getHistory(address: string): Promise<Array<{ tx_hash: string; height: number }>> {
    return (await this.callRpc("blockchain.address.get_history", [address])) as Array<{
      tx_hash: string;
      height: number;
    }>;
  }

  public async getTransaction(txHash: string): Promise<string> {
    return (await this.callRpc("blockchain.transaction.get", [txHash])) as string;
  }

  public disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.updateState("disconnected");
  }

  private callRpc(method: string, params: unknown[]): Promise<unknown> {
    const id = ++this.reqId;
    const msg = JSON.stringify({ id, method, params });
    this.log("out", msg, method);

    return new Promise((resolve, reject) => {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        reject(new Error("WebSocket not connected"));
        return;
      }
      this.pendingCallbacks.set(id, resolve);
      this.ws.send(msg);
    });
  }

  private log(direction: "in" | "out", payload: string, method?: string) {
    const entry: MempoolEventLog = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
      direction,
      method,
      payload,
    };
    this.onLogCallback?.(entry);
  }

  private updateState(state: ConnectionState) {
    this.connectionState = state;
    this.onStateChangeCallback?.(state);
  }
}
