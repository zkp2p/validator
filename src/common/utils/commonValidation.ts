import { z } from "zod";

const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
const bytes32Regex = /^0x[a-fA-F0-9]{64}$/;
const currencyCodeRegex = /^[A-Z]{3}$/;

export const commonValidations = {
  id: z
    .string()
    .refine((data) => !Number.isNaN(Number(data)), "ID must be a numeric value")
    .transform(Number)
    .refine((num) => num > 0, "ID must be a positive number"),
  // ... other common validations
  ethereumAddress: z.string().regex(ethAddressRegex, "Invalid Ethereum address"),
  bytes32: z.string().regex(bytes32Regex, "Invalid bytes32 value"),
  currencyCode: z.string().regex(currencyCodeRegex, "Invalid currency code"),
  depositId: z
    .string()
    .refine((data) => !Number.isNaN(Number(data)), "ID must be a numeric value")
    .transform(Number)
    .refine((num) => num >= 0, "ID must be a non-negative number"),
};
