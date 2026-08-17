import { z } from "zod";
import { CHZZK_API_BASE_URL } from "./config.js";
import { ChzzkApiError } from "./errors.js";
const errorSchema = z.object({
    code: z.union([z.string(), z.number()]),
    message: z.string().nullable().optional(),
});
export class ChzzkClient {
    config;
    constructor(config) {
        this.config = config;
    }
    async request(path, schema, options = {}) {
        const { accessToken, clientAuth, headers: suppliedHeaders, ...init } = options;
        const headers = new Headers(suppliedHeaders);
        headers.set("Content-Type", "application/json");
        if (accessToken)
            headers.set("Authorization", `Bearer ${accessToken}`);
        if (clientAuth) {
            headers.set("Client-Id", this.config.clientId);
            headers.set("Client-Secret", this.config.clientSecret);
        }
        const response = await fetch(`${CHZZK_API_BASE_URL}${path}`, {
            ...init,
            headers,
            cache: "no-store",
        });
        const payload = await response.json().catch(() => null);
        if (!response.ok) {
            const parsed = errorSchema.safeParse(payload);
            const message = parsed.success
                ? parsed.data.message ?? String(parsed.data.code)
                : `HTTP ${response.status}`;
            throw new ChzzkApiError(response.status === 401 ? "CHZZK_TOKEN_EXPIRED" : "CHZZK_API_ERROR", message, response.status);
        }
        const wrapped = z.object({
            code: z.number(),
            message: z.string().nullable(),
            content: schema,
        }).safeParse(payload);
        if (!wrapped.success) {
            throw new ChzzkApiError("CHZZK_API_ERROR", "Invalid CHZZK API response", 502, wrapped.error);
        }
        return wrapped.data.content;
    }
}
//# sourceMappingURL=client.js.map