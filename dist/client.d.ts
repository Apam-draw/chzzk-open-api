import { z } from "zod";
import { type ChzzkConfig } from "./config.js";
export interface ChzzkRequestOptions extends RequestInit {
    accessToken?: string;
    clientAuth?: boolean;
}
export declare class ChzzkClient {
    private readonly config;
    constructor(config: ChzzkConfig);
    request<T>(path: string, schema: z.ZodType<T>, options?: ChzzkRequestOptions): Promise<T>;
}
//# sourceMappingURL=client.d.ts.map