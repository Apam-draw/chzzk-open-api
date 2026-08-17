export type ChzzkErrorCode = "CHZZK_TOKEN_EXPIRED" | "CHZZK_API_ERROR";

export class ChzzkApiError extends Error {
  constructor(
    public readonly code: ChzzkErrorCode,
    message: string,
    public readonly status: number,
    public override readonly cause?: unknown,
  ) {
    super(message, cause === undefined ? undefined : { cause });
    this.name = "ChzzkApiError";
  }
}
