import { z } from "zod";
import { ChzzkClient } from "./client.js";
const currentUserSchema = z.object({
    channelId: z.string(),
    channelName: z.string(),
});
export function getCurrentUser(config, accessToken) {
    return new ChzzkClient(config).request("/open/v1/users/me", currentUserSchema, { accessToken });
}
//# sourceMappingURL=user.js.map