import { createHash } from "node:crypto";
import { z } from "zod";
import { ChzzkClient } from "./client.js";
import type { ChzzkConfig } from "./config.js";

export interface ChatEvent {
  provider: "chzzk";
  eventId: string;
  channelId: string;
  sender: { channelId: string; nickname: string };
  message: string;
  sentAt: string;
}

export interface ChzzkChatEnvelope {
  receivedAt?: string;
  payload: unknown;
}

const rawChatSchema = z.object({
  channelId: z.string().min(1),
  senderChannelId: z.string().min(1),
  profile: z.object({ nickname: z.string().min(1) }).passthrough(),
  content: z.string(),
  messageTime: z.coerce.number().int().nonnegative(),
}).passthrough();

const sendMessageResultSchema = z.object({ messageId: z.string() });

export function normalizeChat(envelope: ChzzkChatEnvelope): ChatEvent {
  const raw = rawChatSchema.parse(envelope.payload);
  const sentAt = Number.isFinite(raw.messageTime)
    ? new Date(raw.messageTime).toISOString()
    : envelope.receivedAt ?? new Date().toISOString();
  const fingerprint = JSON.stringify({
    channelId: raw.channelId,
    senderChannelId: raw.senderChannelId,
    content: raw.content,
    messageTime: raw.messageTime,
  });
  return {
    provider: "chzzk",
    eventId: `chat:${createHash("sha256").update(fingerprint).digest("hex")}`,
    channelId: raw.channelId,
    sender: { channelId: raw.senderChannelId, nickname: raw.profile.nickname },
    message: raw.content,
    sentAt,
  };
}

export function sendChatMessage(
  config: ChzzkConfig,
  accessToken: string,
  message: string,
): Promise<{ messageId: string }> {
  return new ChzzkClient(config).request("/open/v1/chats/send", sendMessageResultSchema, {
    method: "POST",
    accessToken,
    body: JSON.stringify({ message }),
  });
}
