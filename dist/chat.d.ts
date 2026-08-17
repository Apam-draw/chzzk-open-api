import type { ChzzkConfig } from "./config.js";
export interface ChatEvent {
    provider: "chzzk";
    eventId: string;
    channelId: string;
    sender: {
        channelId: string;
        nickname: string;
    };
    message: string;
    sentAt: string;
}
export interface ChzzkChatEnvelope {
    receivedAt?: string;
    payload: unknown;
}
export declare function normalizeChat(envelope: ChzzkChatEnvelope): ChatEvent;
export declare function sendChatMessage(config: ChzzkConfig, accessToken: string, message: string): Promise<{
    messageId: string;
}>;
//# sourceMappingURL=chat.d.ts.map