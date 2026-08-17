import { z } from "zod";
import { ChzzkClient } from "./client.js";
import type { ChzzkConfig } from "./config.js";

const channelSchema = z.object({
  channelId: z.string(),
  channelName: z.string(),
});
const channelsSchema = z.object({ data: z.array(channelSchema) });

export type ChzzkChannel = z.infer<typeof channelSchema>;

export async function getChannel(config: ChzzkConfig, channelId: string): Promise<ChzzkChannel | null> {
  const query = new URLSearchParams();
  query.append("channelIds", channelId);
  const result = await new ChzzkClient(config).request(`/open/v1/channels?${query}`, channelsSchema, {
    clientAuth: true,
  });
  return result.data[0] ?? null;
}
