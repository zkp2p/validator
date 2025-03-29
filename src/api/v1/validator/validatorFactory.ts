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

/**
 * Interface for the Wise API client
 */
export interface WiseApiClient {
  getTransactions(apiKey: string): Promise<any[]>;
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
    // This would be replaced with an actual implementation
    return {
      getTransactions: async (apiKey: string): Promise<any[]> => {
        try {
          logger.info("Fetching transactions from Wise API");
          // In a real implementation, this would make an HTTP request to Wise
          // For now, we'll return mock data
          return [
            {
              id: "123456",
              reference: "ZKP2P-123",
              amount: 100,
              currency: "USD",
              senderName: "John Doe",
              date: new Date().toISOString(),
              status: "completed"
            }
          ];
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
      const client = this.createDstackClient();
      const quoteResult = await client.tdxQuote(userData, 'sha256');
      return quoteResult.quote;
    } catch (error) {
      logger.error(`Error generating RA report: ${(error as Error).message}`);
      throw new Error(`RA report generation failed: ${(error as Error).message}`);
    }
  }
} 