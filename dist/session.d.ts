import type { ChzzkConfig } from "./config.js";
import type { ChatEvent } from "./chat.js";
import type { DonationEvent } from "./donation.js";
import type { ChzzkLogger } from "./logger.js";
interface SystemMessage {
    type?: string;
    data?: {
        sessionKey?: string;
    };
}
export interface ChzzkSessionConnectInput {
    url: string;
    accessToken: string;
    onDonation: (event: DonationEvent, raw: unknown) => Promise<void>;
    onChat?: (event: ChatEvent, raw: unknown) => Promise<void>;
    onDisconnect?: () => void;
}
export declare function parseSystemMessage(payload: unknown): SystemMessage;
export declare function createSession(config: ChzzkConfig, accessToken: string): Promise<{
    url: string;
}>;
export declare function subscribeDonation(config: ChzzkConfig, accessToken: string, sessionKey: string): Promise<void>;
export declare function subscribeChat(config: ChzzkConfig, accessToken: string, sessionKey: string): Promise<void>;
export declare class ChzzkSessionManager {
    private readonly config;
    private readonly logger;
    private socket;
    constructor(config: ChzzkConfig, logger?: ChzzkLogger);
    connect(input: ChzzkSessionConnectInput): void;
    disconnect(): void;
}
export {};
//# sourceMappingURL=session.d.ts.map