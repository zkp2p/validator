import { TappdClient } from '@phala/dstack-sdk';
import { logger } from "@/server";

/**
 * Interface for the AppKey encryption service that handles 
 * encryption/decryption operations using the TEE's AppKey
 */
export interface AppKeyEncryptionService {
  encrypt(data: string): Promise<string>;
  decrypt(encryptedData: string): Promise<string>;
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
  amount: number;
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
   * Returns the AppKey encryption service for the TEE
   */
  getAppKeyEncryptionService(): AppKeyEncryptionService {
    if (!ValidatorFactory.appKeyService) {
      logger.info("Initializing AppKey encryption service");
      // In a real implementation, this would use the Phala Cloud's AppKey
      ValidatorFactory.appKeyService = {
        encrypt: async (data: string): Promise<string> => {
          // In production, this would use the TEE's AppKey via Phala Cloud
          // For now, we'll simulate encryption
          try {
            logger.info("Encrypting data with AppKey");
            // This is a placeholder for the actual encryption with AppKey
            return Buffer.from(data).toString('base64');
          } catch (error) {
            logger.error(`Error encrypting with AppKey: ${(error as Error).message}`);
            throw new Error(`AppKey encryption failed: ${(error as Error).message}`);
          }
        },
        decrypt: async (encryptedData: string): Promise<string> => {
          // In production, this would use the TEE's AppKey via Phala Cloud
          // For now, we'll simulate decryption
          try {
            logger.info("Decrypting data with AppKey");
            // This is a placeholder for the actual decryption with AppKey
            return Buffer.from(encryptedData, 'base64').toString();
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

          const response = await fetch('https://api.sandbox.transferwise.tech/v1/profiles', {
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
          const response = await fetch(`https://api.sandbox.transferwise.tech/v1/profiles/${profileId}/activities`, {
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
                amount,
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
                amount: 0,
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