import { describe, expect, it } from "vitest";
import { normalizeDonation } from "./donation.js";

describe("normalizeDonation", () => {
  it("normalizes an official donation payload", () => {
    const event = normalizeDonation({
      eventId: "evt-1",
      receivedAt: "2026-08-13T00:00:00.000Z",
      payload: {
        donationType: "CHAT",
        channelId: "channel",
        donatorChannelId: "donor",
        donatorNickname: "viewer",
        payAmount: "5000",
        donationText: "dry flower",
      },
    });
    expect(event).toEqual({
      provider: "chzzk",
      eventId: "evt-1",
      channelId: "channel",
      donor: { channelId: "donor", nickname: "viewer", anonymous: false },
      amount: 5000,
      message: "dry flower",
      donatedAt: "2026-08-13T00:00:00.000Z",
    });
  });

  it("creates a deterministic fallback id within the deduplication window", () => {
    const payload = {
      donationType: "CHAT" as const,
      channelId: "channel",
      payAmount: "1000",
      donationText: "hello",
    };
    expect(normalizeDonation({ receivedAt: "2026-08-13T00:01:00.000Z", payload }).eventId)
      .toBe(normalizeDonation({ receivedAt: "2026-08-13T00:08:00.000Z", payload }).eventId);
  });
});
