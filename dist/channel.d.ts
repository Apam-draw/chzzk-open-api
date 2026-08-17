import { z } from "zod";
import type { ChzzkConfig } from "./config.js";
declare const channelSchema: z.ZodObject<{
    channelId: z.ZodString;
    channelName: z.ZodString;
}, z.core.$strip>;
export type ChzzkChannel = z.infer<typeof channelSchema>;
export declare function getChannel(config: ChzzkConfig, channelId: string): Promise<ChzzkChannel | null>;
export {};
//# sourceMappingURL=channel.d.ts.map