export class ChzzkApiError extends Error {
    code;
    status;
    cause;
    constructor(code, message, status, cause) {
        super(message, cause === undefined ? undefined : { cause });
        this.code = code;
        this.status = status;
        this.cause = cause;
        this.name = "ChzzkApiError";
    }
}
//# sourceMappingURL=errors.js.map