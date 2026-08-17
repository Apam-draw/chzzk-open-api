import { z } from "zod";
import { ChzzkClient } from "./client.js";
import { CHZZK_AUTHORIZATION_URL } from "./config.js";
const tokenSchema = z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
    tokenType: z.string(),
    expiresIn: z.coerce.number().positive(),
    scope: z.string().optional(),
});
export function getAuthorizationUrl(config, state) {
    const url = new URL(CHZZK_AUTHORIZATION_URL);
    url.searchParams.set("clientId", config.clientId);
    url.searchParams.set("redirectUri", config.redirectUri);
    url.searchParams.set("state", state);
    return url.toString();
}
export function exchangeCode(config, code, state) {
    return new ChzzkClient(config).request("/auth/v1/token", tokenSchema, {
        method: "POST",
        body: JSON.stringify({
            grantType: "authorization_code",
            clientId: config.clientId,
            clientSecret: config.clientSecret,
            code,
            state,
        }),
    });
}
export function refreshToken(config, refreshTokenValue) {
    return new ChzzkClient(config).request("/auth/v1/token", tokenSchema, {
        method: "POST",
        body: JSON.stringify({
            grantType: "refresh_token",
            refreshToken: refreshTokenValue,
            clientId: config.clientId,
            clientSecret: config.clientSecret,
        }),
    });
}
//# sourceMappingURL=auth.js.map