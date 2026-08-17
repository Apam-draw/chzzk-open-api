import { describe, expect, it } from "vitest";
import { parseSystemMessage } from "./session.js";

describe("parseSystemMessage", () => {
  it("parses a serialized Socket.IO system message", () => {
    expect(parseSystemMessage('{"type":"connected","data":{"sessionKey":"session-1"}}')).toEqual({
      type: "connected",
      data: { sessionKey: "session-1" },
    });
  });

  it("parses an object system message", () => {
    expect(parseSystemMessage({ type: "subscribed", data: { eventType: "DONATION" } })).toEqual({
      type: "subscribed",
    });
  });
});
