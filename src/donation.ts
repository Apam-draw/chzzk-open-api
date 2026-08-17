import { createHash } from "node:crypto";
import { z } from "zod";

export interface DonationEvent {
  provider: "chzzk";
  eventId: string;
  channelId: string;
  donor: { channelId?: string; nickname?: string; anonymous: boolean };
  amount: number;
  message: string;
  donatedAt: string;
}

export interface ChzzkDonationEnvelope {
  eventId?: string;
  receivedAt?: string;
  payload: unknown;
}

const rawDonationSchema = z.object({
  donationType: z.enum(["CHAT", "VIDEO"]),
  channelId: z.string().min(1),
  donatorChannelId: z.string().nullish(),
  donatorNickname: z.string().nullish(),
  payAmount: z.coerce.number().int().nonnegative(),
  donationText: z.string().default(""),
}).passthrough();

export type ChzzkDonationPayload = z.infer<typeof rawDonationSchema>;

const PROVIDER_ID_KEYS = ["eventId", "donationId", "messageId", "transactionId"] as const;
const FALLBACK_DEDUP_WINDOW_MS = 10 * 60_000;

function getProviderEventId(payload: Record<string, unknown>): string | null {
  for (const key of PROVIDER_ID_KEYS) {
    const value = payload[key];
    if (typeof value === "string" && value) return `${key}:${value}`;
    if (typeof value === "number" && Number.isFinite(value)) return `${key}:${value}`;
  }
  return null;
}

function stableSerialize(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableSerialize).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.entries(value as Record<string, unknown>)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, item]) => `${JSON.stringify(key)}:${stableSerialize(item)}`)
      .join(",")}}`;
  }
  return JSON.stringify(value) ?? "null";
}

export function normalizeDonation(envelope: ChzzkDonationEnvelope): DonationEvent {
  const raw = rawDonationSchema.parse(envelope.payload);
  const donatedAt = envelope.receivedAt ?? new Date().toISOString();
  const providerEventId = getProviderEventId(raw);
  const parsedReceivedAt = Date.parse(donatedAt);
  const receivedMs = Number.isFinite(parsedReceivedAt) ? parsedReceivedAt : Date.now();
  const timeBucket = Math.floor(receivedMs / FALLBACK_DEDUP_WINDOW_MS);
  const fingerprint = stableSerialize({ payload: raw, timeBucket });
  const eventId = envelope.eventId
    ?? providerEventId
    ?? `fallback:${createHash("sha256").update(fingerprint).digest("hex")}`;
  const anonymous = !raw.donatorChannelId && !raw.donatorNickname;
  return {
    provider: "chzzk",
    eventId,
    channelId: raw.channelId,
    donor: {
      ...(raw.donatorChannelId ? { channelId: raw.donatorChannelId } : {}),
      ...(raw.donatorNickname ? { nickname: raw.donatorNickname } : {}),
      anonymous,
    },
    amount: raw.payAmount,
    message: raw.donationText,
    donatedAt,
  };
}
