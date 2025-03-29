import { env } from "@/common/utils/envConfig";

/**
 * For each issuer, store:
 * - spki: A PEM-encoded public key (SPKI)
 * - alg: The JWT signing algorithm (e.g., ES256, RS256, etc.)
 * - audience: The expected "aud" claim in the token
 */
export const providerConfig: Record<string, { spki: string; alg: string; audience: string }> = {
  "privy.io": {
    spki: env.PRIVY_JWT_VERIFICATION_KEY,
    alg: "ES256",
    audience: env.PRIVY_APP_ID,
  },
};
