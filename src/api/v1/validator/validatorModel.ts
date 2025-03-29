import { z } from "zod";

// Schema for encrypt request
export const EncryptRequestSchema = z.object({
  wiseApiKey: z.string(),
  processorName: z.string(),
  hashedOnchainId: z.string(),
  depositData: z.record(z.unknown()), // Any JSON data for deposit details
});

// Schema for encrypt response
export const EncryptResponseSchema = z.object({
  encryptedCredentials: z.string(),
  success: z.boolean(),
  message: z.string().optional(),
});

// Schema for verification request
export const VerifyPaymentRequestSchema = z.object({
  encryptedCredentials: z.string(),
  paymentDetails: z.object({
    reference: z.string(),
    amount: z.number(),
    currency: z.string(),
    // Optional additional payment identifiers
    senderName: z.string().optional(),
    senderEmail: z.string().optional(),
    transferId: z.string().optional(),
  }),
});

// Schema for verification response
export const VerifyPaymentResponseSchema = z.object({
  verified: z.boolean(),
  quote: z.string().optional(), // Minimal confirmation details if verified
  message: z.string().optional(),
});

// Define types for each schema
export type EncryptRequest = z.infer<typeof EncryptRequestSchema>;
export type EncryptResponse = z.infer<typeof EncryptResponseSchema>;
export type VerifyPaymentRequest = z.infer<typeof VerifyPaymentRequestSchema>;
export type VerifyPaymentResponse = z.infer<typeof VerifyPaymentResponseSchema>;

// External API client interface
export interface WiseApiTransaction {
  id: string;
  reference: string;
  amount: number;
  currency: string;
  senderName?: string;
  senderEmail?: string;
  transferId?: string;
  date: string;
  status: string;
  // Other transaction properties as needed
} 