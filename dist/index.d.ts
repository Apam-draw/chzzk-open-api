import type { ChzzkConfig } from "./config.js";
export declare function createChzzk(config: ChzzkConfig): {
    auth: {
        getAuthorizationUrl: (state: string) => string;
        exchangeCode: (code: string, state: string) => Promise<{
            accessToken: string;
            refreshToken: string;
            tokenType: string;
            expiresIn: number;
            scope?: string | undefined;
        }>;
        refreshToken: (token: string) => Promise<{
            accessToken: string;
            refreshToken: string;
            tokenType: string;
            expiresIn: number;
            scope?: string | undefined;
        }>;
    };
    user: {
        getCurrentUser: (token: string) => Promise<{
            channelId: string;
            channelName: string;
        }>;
    };
    channel: {
        get: (channelId: string) => Promise<{
            channelId: string;
            channelName: string;
        } | null>;
    };
    chat: {
        sendMessage: (token: string, message: string) => Promise<{
            messageId: string;
        }>;
    };
    session: {
        create: (token: string) => Promise<{
            url: string;
        }>;
        subscribeDonation: (token: string, key: string) => Promise<void>;
        subscribeChat: (token: string, key: string) => Promise<void>;
    };
};
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
//# sourceMappingURL=index.d.ts.map