import { TappdClient } from '@phala/dstack-sdk';
import { logger } from "@/server";
import crypto from 'crypto';
import { env } from "@/common/utils/envConfig";

/**
 * Interface for the AppKey encryption service that handles 
 * encryption/decryption operations using the TEE's AppKey
 */
export interface AppKeyEncryptionService {
  encrypt(data: string): Promise<{ encryptedData: string, encryptionIV: string }>;
  decrypt(encryptedData: string, encryptionIV: string): Promise<string>;
}

export interface WiseTransaction {
  id: string;
  type: string;
  resource: {
    type: string;
    id: string;
  };
  title: string;
  description: string;
  primaryAmount: string;
  secondaryAmount: string;
  status: string;
  createdOn: string;
  updatedOn: string;
}

export interface WiseFormattedTransaction {
  paymentId: string;
  amount: string;
  currency: string;
  date: string;
  status: string;
  recipientId: string;
  type: 'received' | 'sent';
}

/**
 * Interface for the Wise API client
 */
export interface WiseApiClient {
  getTransactions(apiKey: string): Promise<WiseFormattedTransaction[]>;
  getProfileId(apiKey: string): Promise<string>;
}

/**
 * ValidatorFactory is responsible for creating and providing access to
 * various services like dStack client, AppKey encryption, and external APIs
 */
export class ValidatorFactory {
  private static dstackClient: TappdClient | null = null;
  private static appKeyService: AppKeyEncryptionService | null = null;
  private static encryptionKey: Uint8Array | null = null;

  /**
   * Creates or returns a singleton instance of the dStack client
   */
  createDstackClient(): TappdClient {
    if (!ValidatorFactory.dstackClient) {
      logger.info("Initializing dStack client");
      ValidatorFactory.dstackClient = new TappdClient();
    }
    return ValidatorFactory.dstackClient;
  }

  /**
   * Gets or derives the encryption key
   */
  private async getEncryptionKey(): Promise<Uint8Array> {
    if (!ValidatorFactory.encryptionKey) {
      logger.info("Deriving encryption key from dStack client");

      // Create a dStack client
      const client = this.createDstackClient();

      // Derive a deterministic key for encryption
      const keyResult = await client.deriveKey('encryption-key');
      const keyBytes = keyResult.asUint8Array();

      // Use only the first 32 bytes for AES-256
      ValidatorFactory.encryptionKey = keyBytes.slice(0, 32);
    }

    return ValidatorFactory.encryptionKey;
  }

  /**
   * Returns the AppKey encryption service for the TEE
   */
  getAppKeyEncryptionService(): AppKeyEncryptionService {
    if (!ValidatorFactory.appKeyService) {
      logger.info("Initializing AppKey encryption service");

      // In a real implementation, this would use the Phala Cloud's AppKey
      ValidatorFactory.appKeyService = {
        encrypt: async (data: string): Promise<{ encryptedData: string, encryptionIV: string }> => {
          try {
            logger.info("Encrypting data with AppKey");

            // Get the cached encryption key
            const aesKey = await this.getEncryptionKey();

            // Generate a random IV
            const iv = crypto.randomBytes(16);

            // Create cipher
            const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(aesKey), iv);

            // Encrypt the data
            let encrypted = cipher.update(data, 'utf8', 'base64');
            encrypted += cipher.final('base64');

            // Return both the encrypted data and the IV
            return {
              encryptedData: encrypted,
              encryptionIV: iv.toString('base64')
            };
          } catch (error) {
            logger.error(`Error encrypting with AppKey: ${(error as Error).message}`);
            throw new Error(`AppKey encryption failed: ${(error as Error).message}`);
          }
        },
        decrypt: async (encryptedData: string, encryptionIV: string): Promise<string> => {
          try {
            logger.info("Decrypting data with AppKey");

            // Get the cached encryption key
            const aesKey = await this.getEncryptionKey();

            // Parse the IV from base64
            const ivBuffer = Buffer.from(encryptionIV, 'base64');

            // Create decipher
            const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(aesKey), ivBuffer);

            // Decrypt the data
            let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
            decrypted += decipher.final('utf8');

            return decrypted;
          } catch (error) {
            logger.error(`Error decrypting with AppKey: ${(error as Error).message}`);
            throw new Error(`AppKey decryption failed: ${(error as Error).message}`);
          }
        }
      };
    }
    return ValidatorFactory.appKeyService;
  }

  /**
   * Creates a client for the Wise API
   */
  createWiseApiClient(): WiseApiClient {
    logger.info("Creating Wise API client");

    return {
      /**
       * Gets the Wise profile ID using the provided API key
       */
      getProfileId: async (apiKey: string): Promise<string> => {
        try {
          logger.info("Fetching profile ID from Wise API");

          const response = await fetch(`${env.WISE_API_BASE_URL}/v1/profiles`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json'
            }
          });

          if (!response.ok) {
            throw new Error(`Wise API returned ${response.status}: ${response.statusText}`);
          }

          // Get raw response
          const data = await response.json();

          // Simply extract the first id we can find
          let profileId = null;

          // If it's an array, get the first item's id
          if (Array.isArray(data) && data.length > 0 && data[0].id) {
            profileId = data[0].id;
          }
          // If it's an object with id directly at the root
          else if (data && typeof data === 'object' && data.id) {
            profileId = data.id;
          }

          if (!profileId) {
            throw new Error('No profile ID found in response');
          }

          logger.info(`Found profile ID: ${profileId}`);
          return profileId;
        } catch (error) {
          logger.error(`Error fetching Wise profile: ${(error as Error).message}`);
          throw new Error(`Wise API profile request failed: ${(error as Error).message}`);
        }
      },

      /**
       * Gets transactions from the Wise API using the provided API key
       */
      getTransactions: async (apiKey: string): Promise<WiseFormattedTransaction[]> => {
        try {
          logger.info("Fetching transactions from Wise API");

          // First get the profile ID
          const profileId = await this.createWiseApiClient().getProfileId(apiKey);

          logger.info(`Profile ID: ${profileId}`);

          // Then fetch the transactions
          const response = await fetch(`${env.WISE_API_BASE_URL}/v1/profiles/${profileId}/activities`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json'
            }
          });

          if (!response.ok) {
            throw new Error(`Wise API returned ${response.status}: ${response.statusText}`);
          }

          // Get raw response, handle potential inconsistencies
          const responseData = await response.json();
          const transactions = responseData.activities ? Array.isArray(responseData.activities) ? responseData.activities : [] : [];

          logger.info(`Transactions: ${JSON.stringify(transactions)}`);

          // Map the Wise API response to our expected format with safety checks
          return transactions.map((tx: any): WiseFormattedTransaction => {
            try {
              // Get resource safely
              const resource = tx.resource || {};
              const resourceId = resource.id || '';

              // Safe property access for various fields
              const primaryAmount = tx.primaryAmount || "0 USD";
              const createdOn = tx.createdOn || new Date().toISOString();
              const status = tx.status || "UNKNOWN";

              // Extract amount and currency with defensive coding
              let amountStr = primaryAmount;
              let currency = "USD"; // Default currency if not found
              let amount = 0;
              let transactionType: 'received' | 'sent' = 'sent';

              // Check if this is a received payment (contains "+" or "<positive>")
              if (amountStr.includes('+') || amountStr.includes('<positive>')) {
                transactionType = 'received';
              }

              // Remove HTML tags and + signs if present
              amountStr = amountStr
                .replace(/<\/?[^>]+(>|$)/g, "")
                .replace(/\+/g, "")
                .trim();

              // Extract amount and currency
              const amountMatch = amountStr.match(/([0-9.]+)\s*([A-Z]{3})/);
              if (amountMatch) {
                amount = parseFloat(amountMatch[1]);
                currency = amountMatch[2];
              }

              return {
                paymentId: resourceId,
                amount: amount.toString(),
                currency,
                date: createdOn,
                status,
                type: transactionType,
                recipientId: profileId
              };
            } catch (err) {
              // If there's an error processing this transaction, log it but don't fail the entire operation
              logger.info(`Error processing transaction: ${(err as Error).message}`);

              // Return a placeholder transaction with minimal data
              return {
                paymentId: tx.id || `error-${Date.now()}`,
                amount: "0",
                currency: "USD",
                date: new Date().toISOString(),
                status: "ERROR",
                type: 'sent',
                recipientId: ""
              };
            }
          });
        } catch (error) {
          logger.error(`Error fetching Wise transactions: ${(error as Error).message}`);
          throw new Error(`Wise API request failed: ${(error as Error).message}`);
        }
      }
    };
  }

  /**
   * Generates an RA report using the dStack SDK
   */
  async generateRAReport(userData: string): Promise<string> {
    try {
      logger.info("Generating RA report");

      if (!userData) {
        logger.warn("No user data provided for RA report, using default empty value");
      }

      const client = this.createDstackClient();

      // Add metadata to the quote
      const metadata = {
        timestamp: new Date().toISOString(),
        userDataHash: userData ? 'sha256' : 'none',
        version: '1.0.0'
      };

      // Combine the userData with metadata
      const dataToQuote = userData ?
        JSON.stringify({ userData, metadata }) :
        JSON.stringify({ metadata });

      // Get the quote from the TEE
      const quoteResult = await client.tdxQuote(dataToQuote, 'sha256');

      if (!quoteResult || !quoteResult.quote) {
        throw new Error('Failed to generate quote: Empty result received');
      }

      logger.info("RA report generated successfully");
      return quoteResult.quote;
    } catch (error) {
      logger.error(`Error generating RA report: ${(error as Error).message}`);
      throw new Error(`RA report generation failed: ${(error as Error).message}`);
    }
  }
} 