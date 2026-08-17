import { z } from "zod";
import { type ChzzkConfig } from "./config.js";
declare const tokenSchema: z.ZodObject<{
    accessToken: z.ZodString;
    refreshToken: z.ZodString;
    tokenType: z.ZodString;
    expiresIn: z.ZodCoercedNumber<unknown>;
    scope: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type ChzzkToken = z.infer<typeof tokenSchema>;
export declare function getAuthorizationUrl(config: ChzzkConfig, state: string): string;
export declare function exchangeCode(config: ChzzkConfig, code: string, state: string): Promise<ChzzkToken>;
export declare function refreshToken(config: ChzzkConfig, refreshTokenValue: string): Promise<ChzzkToken>;
export {};
//# sourceMappingURL=auth.d.ts.map