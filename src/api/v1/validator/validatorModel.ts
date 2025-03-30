import { z } from "zod";

// Schema for encrypt request
export const EncryptRequestSchema = z.object({
  wiseApiKey: z.string(),
  processorName: z.string()
});

// Schema for encrypt response
export const EncryptResponseSchema = z.object({
  encryptedCredentials: z.string(),
  encryptionIV: z.string(), // Base64 encoded initialization vector
  success: z.boolean(),
});

// Schema for wise payment details
export const WisePaymentDetailsRequestSchema = z.object({
  amount: z.string(),
  timestamp: z.string(),
  currency: z.string(),
  paymentStatus: z.string().optional().default('COMPLETED'),
});

// Schema for verification request
export const VerifyPaymentRequestSchema = z.object({
  encryptedCredentials: z.string(),
  encryptionIV: z.string(), // Base64 encoded initialization vector needed for decryption
  wisePaymentDetails: WisePaymentDetailsRequestSchema,
});

export const QuoteSchema = z.object({
  platform: z.string(),
  paymentId: z.string(),
  amount: z.string(),
  currency: z.string(),
  date: z.string(),
  status: z.string(),
  recipientId: z.string(),
  verifiedAt: z.string()
});

// Schema for verification response
export const VerifyPaymentResponseSchema = z.object({
  verified: z.boolean(),
  quote: QuoteSchema.optional(), // Use QuoteSchema type
  raReport: z.string().optional(), // Remote Attestation report
});


// Define types for each schema
export type EncryptRequest = z.infer<typeof EncryptRequestSchema>;
export type EncryptResponse = z.infer<typeof EncryptResponseSchema>;
export type WisePaymentDetailsRequest = z.infer<typeof WisePaymentDetailsRequestSchema>;
export type VerifyPaymentRequest = z.infer<typeof VerifyPaymentRequestSchema>;
export type VerifyPaymentResponse = z.infer<typeof VerifyPaymentResponseSchema>;