import { z } from "zod";
import type { ChzzkConfig } from "./config.js";
declare const currentUserSchema: z.ZodObject<{
    channelId: z.ZodString;
    channelName: z.ZodString;
}, z.core.$strip>;
export type ChzzkCurrentUser = z.infer<typeof currentUserSchema>;
export declare function getCurrentUser(config: ChzzkConfig, accessToken: string): Promise<ChzzkCurrentUser>;
export {};
//# sourceMappingURL=user.d.ts.map