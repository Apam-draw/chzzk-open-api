import { z } from "zod";
export interface DonationEvent {
    provider: "chzzk";
    eventId: string;
    channelId: string;
    donor: {
        channelId?: string;
        nickname?: string;
        anonymous: boolean;
    };
    amount: number;
    message: string;
    donatedAt: string;
}
export interface ChzzkDonationEnvelope {
    eventId?: string;
    receivedAt?: string;
    payload: unknown;
}
declare const rawDonationSchema: z.ZodObject<{
    donationType: z.ZodEnum<{
        CHAT: "CHAT";
        VIDEO: "VIDEO";
    }>;
    channelId: z.ZodString;
    donatorChannelId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    donatorNickname: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    payAmount: z.ZodCoercedNumber<unknown>;
    donationText: z.ZodDefault<z.ZodString>;
}, z.core.$loose>;
export type ChzzkDonationPayload = z.infer<typeof rawDonationSchema>;
export declare function normalizeDonation(envelope: ChzzkDonationEnvelope): DonationEvent;
export {};
//# sourceMappingURL=donation.d.ts.map