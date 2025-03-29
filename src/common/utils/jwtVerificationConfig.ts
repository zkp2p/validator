import { providerConfig } from "@/common/utils/jwtProviderConfig";
import { decodeJwt, importSPKI } from "jose";

/**
 * Retrieve verification parameters based on the token's issuer claim.
 *
 * @param {string} token - The raw JWT from the "Authorization" header.
 * @returns {Promise<{ verificationKey: CryptoKey, issuer: string, audience: string }>}
 *          Returns an object containing the verificationKey, issuer, and audience.
 *          Throws an error if the token’s iss is missing or unknown.
 */
export async function getJwtVerificationOptions(token: string) {
  // Decode (but do not verify) the token to read its issuer
  const decoded = decodeJwt(token);
  const issuer = decoded.iss;

  if (!issuer || !providerConfig[issuer]) {
    throw new Error(`No config found for issuer "${issuer}"`);
  }

  const { spki, alg, audience } = providerConfig[issuer];

  const verificationKey = await importSPKI(spki, alg);

  return {
    verificationKey,
    issuer,
    audience,
  };
}
