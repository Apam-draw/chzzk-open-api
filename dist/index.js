import { exchangeCode, getAuthorizationUrl, refreshToken } from "./auth.js";
import { getChannel } from "./channel.js";
import { sendChatMessage } from "./chat.js";
import { createSession, subscribeChat, subscribeDonation } from "./session.js";
import { getCurrentUser } from "./user.js";
export function createChzzk(config) {
    return {
        auth: {
            getAuthorizationUrl: (state) => getAuthorizationUrl(config, state),
            exchangeCode: (code, state) => exchangeCode(config, code, state),
            refreshToken: (token) => refreshToken(config, token),
        },
        user: { getCurrentUser: (token) => getCurrentUser(config, token) },
        channel: { get: (channelId) => getChannel(config, channelId) },
        chat: { sendMessage: (token, message) => sendChatMessage(config, token, message) },
        session: {
            create: (token) => createSession(config, token),
            subscribeDonation: (token, key) => subscribeDonation(config, token, key),
            subscribeChat: (token, key) => subscribeChat(config, token, key),
        },
    };
}
export { normalizeChat } from "./chat.js";
export { normalizeDonation } from "./donation.js";
export { ChzzkApiError } from "./errors.js";
export { ChzzkSessionManager, parseSystemMessage } from "./session.js";
//# sourceMappingURL=index.js.map