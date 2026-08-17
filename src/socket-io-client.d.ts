declare module "socket.io-client" {
  export interface Socket {
    on(event: string, listener: (...args: unknown[]) => void): this;
    disconnect(): this;
  }

  export interface ConnectOptions {
    reconnection?: boolean;
    forceNew?: boolean;
    timeout?: number;
    transports?: string[];
  }

  export default function io(uri: string, options?: ConnectOptions): Socket;
}
