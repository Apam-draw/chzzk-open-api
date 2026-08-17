export type ChzzkErrorCode = "CHZZK_TOKEN_EXPIRED" | "CHZZK_API_ERROR";
export declare class ChzzkApiError extends Error {
    readonly code: ChzzkErrorCode;
    readonly status: number;
    readonly cause?: unknown | undefined;
    constructor(code: ChzzkErrorCode, message: string, status: number, cause?: unknown | undefined);
}
//# sourceMappingURL=errors.d.ts.map