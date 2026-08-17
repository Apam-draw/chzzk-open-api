import io, { type Socket } from "socket.io-client";
import { z } from "zod";
import { ChzzkClient } from "./client.js";
import type { ChzzkConfig } from "./config.js";
import type { ChatEvent } from "./chat.js";
import { normalizeChat } from "./chat.js";
import type { DonationEvent } from "./donation.js";
import { normalizeDonation } from "./donation.js";
import type { ChzzkLogger } from "./logger.js";
import { silentChzzkLogger } from "./logger.js";

interface SystemMessage {
  type?: string;
  data?: { sessionKey?: string };
}

export interface ChzzkSessionConnectInput {
  url: string;
  accessToken: string;
  onDonation: (event: DonationEvent, raw: unknown) => Promise<void>;
  onChat?: (event: ChatEvent, raw: unknown) => Promise<void>;
  onDisconnect?: () => void;
}

function parseSocketPayload(payload: unknown): unknown {
  const candidate = Array.isArray(payload) && payload.length === 1 ? payload[0] : payload;
  if (typeof candidate !== "string") return candidate;
  try {
    return JSON.parse(candidate) as unknown;
  } catch {
    return candidate;
  }
}

export function parseSystemMessage(payload: unknown): SystemMessage {
  const parsed = parseSocketPayload(payload);
  if (!parsed || typeof parsed !== "object") return {};
  const type = Reflect.get(parsed, "type");
  const rawData = parseSocketPayload(Reflect.get(parsed, "data"));
  const sessionKey = rawData && typeof rawData === "object"
    ? Reflect.get(rawData, "sessionKey")
    : undefined;
  return {
    ...(typeof type === "string" ? { type } : {}),
    ...(typeof sessionKey === "string" ? { data: { sessionKey } } : {}),
  };
}

export function createSession(config: ChzzkConfig, accessToken: string): Promise<{ url: string }> {
  return new ChzzkClient(config).request(
    "/open/v1/sessions/auth",
    z.object({ url: z.url() }),
    { accessToken },
  );
}

export async function subscribeDonation(
  config: ChzzkConfig,
  accessToken: string,
  sessionKey: string,
): Promise<void> {
  const query = new URLSearchParams({ sessionKey });
  await new ChzzkClient(config).request(
    `/open/v1/sessions/events/subscribe/donation?${query}`,
    z.unknown(),
    { method: "POST", accessToken },
  );
}

export async function subscribeChat(
  config: ChzzkConfig,
  accessToken: string,
  sessionKey: string,
): Promise<void> {
  const query = new URLSearchParams({ sessionKey }).toString();
  await new ChzzkClient(config).request(
    `/open/v1/sessions/events/subscribe/chat?${query}`,
    z.unknown(),
    { method: "POST", accessToken },
  );
}

export class ChzzkSessionManager {
  private socket: Socket | null = null;

  constructor(
    private readonly config: ChzzkConfig,
    private readonly logger: ChzzkLogger = silentChzzkLogger,
  ) {}

  connect(input: ChzzkSessionConnectInput): void {
    this.disconnect();
    this.logger.info("CHZZK_SESSION_CONNECTING", { socketHost: safeHost(input.url) });
    const socket = io(input.url, {
      reconnection: false,
      forceNew: true,
      timeout: 3000,
      transports: ["websocket"],
    });
    this.socket = socket;
    let disconnectNotified = false;
    const notifyDisconnect = () => {
      if (disconnectNotified) return;
      disconnectNotified = true;
      this.logger.info("CHZZK_SESSION_DISCONNECTED");
      input.onDisconnect?.();
    };
    socket.on("SYSTEM", (payload?: unknown) => {
      const rawSystem: unknown = payload;
      const message = parseSystemMessage(rawSystem);
      const sessionKey = message.type === "connected" ? message.data?.sessionKey : undefined;
      this.logger.info("CHZZK_SYSTEM_EVENT_RECEIVED", {
        rawType: Array.isArray(rawSystem) ? "array" : typeof rawSystem,
        parsed: message,
        type: message.type ?? "unknown",
        sessionEstablished: Boolean(sessionKey),
      });
      if (!sessionKey) return;
      void subscribeDonation(this.config, input.accessToken, sessionKey)
        .then(() => this.logger.info("CHZZK_SESSION_CONNECTED", { donationSubscribed: true }))
        .catch((error: unknown) => this.logger.error("CHZZK_SESSION_DISCONNECTED", error));
      if (input.onChat) {
        void subscribeChat(this.config, input.accessToken, sessionKey)
          .then(() => this.logger.info("CHZZK_CHAT_SUBSCRIBED"))
          .catch((error: unknown) => this.logger.error("CHZZK_CHAT_SUBSCRIBE_FAILED", error));
      }
    });
    if (input.onChat) {
      socket.on("CHAT", (payload?: unknown) => {
        const raw: unknown = parseSocketPayload(payload);
        const receivedAt = new Date().toISOString();
        this.logger.info("CHAT_RAW_RECEIVED", { raw });
        try {
          const event = normalizeChat({ payload: raw, receivedAt });
          this.logger.info("CHAT_NORMALIZED", { chatEvent: event });
          void input.onChat?.(event, raw).catch((error: unknown) => {
            this.logger.error("CHAT_WORKER_ERROR", error, {
              eventId: event.eventId,
              channelId: event.channelId,
            });
          });
        } catch (error) {
          this.logger.error("CHAT_NORMALIZE_FAILED", error, { raw });
        }
      });
    }
    socket.on("DONATION", (payload?: unknown) => {
      const raw: unknown = parseSocketPayload(payload);
      const receivedAt = new Date().toISOString();
      this.logger.info("DONATION_RAW_RECEIVED", { raw });
      try {
        const event = normalizeDonation({ payload: raw, receivedAt });
        this.logger.info("DONATION_NORMALIZED", { event });
        void input.onDonation(event, raw).catch((error: unknown) => {
          this.logger.error("DONATION_WORKER_ERROR", error, {
            eventId: event.eventId,
            channelId: event.channelId,
          });
        });
      } catch (error) {
        this.logger.error("DONATION_NORMALIZE_FAILED", error, { raw });
      }
    });
    socket.on("disconnect", (reason?: unknown) => {
      this.logger.info("CHZZK_SOCKET_DISCONNECTED", { reason: String(reason ?? "unknown") });
      notifyDisconnect();
    });
    socket.on("connect_error", (error?: unknown) => {
      this.logger.error("CHZZK_SOCKET_CONNECT_ERROR", error);
      notifyDisconnect();
    });
  }

  disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
  }
}

function safeHost(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return "invalid-url";
  }
}
