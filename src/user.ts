import { z } from "zod";
import { ChzzkClient } from "./client.js";
import type { ChzzkConfig } from "./config.js";

const currentUserSchema = z.object({
  channelId: z.string(),
  channelName: z.string(),
});

export type ChzzkCurrentUser = z.infer<typeof currentUserSchema>;

export function getCurrentUser(config: ChzzkConfig, accessToken: string): Promise<ChzzkCurrentUser> {
  return new ChzzkClient(config).request("/open/v1/users/me", currentUserSchema, { accessToken });
}
