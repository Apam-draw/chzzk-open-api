import { exchangeCode, getAuthorizationUrl, refreshToken } from "./auth.js";
import { getChannel } from "./channel.js";
import { sendChatMessage } from "./chat.js";
import type { ChzzkConfig } from "./config.js";
import { createSession, subscribeChat, subscribeDonation } from "./session.js";
import { getCurrentUser } from "./user.js";

export function createChzzk(config: ChzzkConfig) {
  return {
    auth: {
      getAuthorizationUrl: (state: string) => getAuthorizationUrl(config, state),
      exchangeCode: (code: string, state: string) => exchangeCode(config, code, state),
      refreshToken: (token: string) => refreshToken(config, token),
    },
    user: { getCurrentUser: (token: string) => getCurrentUser(config, token) },
    channel: { get: (channelId: string) => getChannel(config, channelId) },
    chat: { sendMessage: (token: string, message: string) => sendChatMessage(config, token, message) },
    session: {
      create: (token: string) => createSession(config, token),
      subscribeDonation: (token: string, key: string) => subscribeDonation(config, token, key),
      subscribeChat: (token: string, key: string) => subscribeChat(config, token, key),
    },
  };
}

export type { ChzzkToken } from "./auth.js";
export type { ChzzkChannel } from "./channel.js";
export type { ChatEvent, ChzzkChatEnvelope } from "./chat.js";
export { normalizeChat } from "./chat.js";
export type { ChzzkConfig } from "./config.js";
export type { ChzzkDonationEnvelope, ChzzkDonationPayload, DonationEvent } from "./donation.js";
export { normalizeDonation } from "./donation.js";
export type { ChzzkErrorCode } from "./errors.js";
export { ChzzkApiError } from "./errors.js";
export type { ChzzkLogContext, ChzzkLogger } from "./logger.js";
export { ChzzkSessionManager, parseSystemMessage } from "./session.js";
export type { ChzzkSessionConnectInput } from "./session.js";
export type { ChzzkCurrentUser } from "./user.js";
