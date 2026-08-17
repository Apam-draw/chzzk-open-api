import { z } from "zod";
import { ChzzkClient } from "./client.js";
const channelSchema = z.object({
    channelId: z.string(),
    channelName: z.string(),
});
const channelsSchema = z.object({ data: z.array(channelSchema) });
export async function getChannel(config, channelId) {
    const query = new URLSearchParams();
    query.append("channelIds", channelId);
    const result = await new ChzzkClient(config).request(`/open/v1/channels?${query}`, channelsSchema, {
        clientAuth: true,
    });
    return result.data[0] ?? null;
}
//# sourceMappingURL=channel.js.map