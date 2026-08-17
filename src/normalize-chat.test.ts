import { describe, expect, it } from "vitest";
import { normalizeChat } from "./chat.js";

describe("normalizeChat", () => {
  it("normalizes an official CHAT payload", () => {
    const event = normalizeChat({
      payload: {
        channelId: "streamer-channel",
        senderChannelId: "viewer-channel",
        profile: { nickname: "viewer", badges: [], verifiedMark: false },
        content: "!request dry flower",
        emojis: {},
        messageTime: 1_786_650_000_000,
      },
    });
    expect(event).toMatchObject({
      provider: "chzzk",
      channelId: "streamer-channel",
      sender: { channelId: "viewer-channel", nickname: "viewer" },
      message: "!request dry flower",
      sentAt: new Date(1_786_650_000_000).toISOString(),
    });
    expect(event.eventId).toMatch(/^chat:[a-f0-9]{64}$/u);
  });
});
