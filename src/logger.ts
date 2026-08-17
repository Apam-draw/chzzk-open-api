export type ChzzkLogContext = Record<string, unknown>;

export interface ChzzkLogger {
  info(event: string, context?: ChzzkLogContext): void;
  error(event: string, error: unknown, context?: ChzzkLogContext): void;
}

export const silentChzzkLogger: ChzzkLogger = {
  info() {},
  error() {},
};
