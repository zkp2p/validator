import { StatusCodes } from "http-status-codes";
import { logger } from "@/server";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { ValidatorFactory } from "./validatorFactory";
import {
  EncryptRequest,
  EncryptResponse,
  VerifyPaymentRequest,
  VerifyPaymentResponse,
  WiseApiTransaction
} from "./validatorModel";

/**
 * ValidatorService handles operations related to credential encryption
 * and payment verification within the TEE environment
 */
export class ValidatorService {
  private factory: ValidatorFactory;

  constructor(factory: ValidatorFactory = new ValidatorFactory()) {
    this.factory = factory;
  }

  /**
   * Encrypts sensitive credentials (e.g., Wise API key) using the TEE's AppKey
   */
  async encryptCredentials(request: EncryptRequest): Promise<ServiceResponse<EncryptResponse>> {
    try {
      logger.info("Encrypting credentials");

      // Validate the request data
      if (!request.wiseApiKey) {
        return ServiceResponse.failure(
          "Missing required API key",
          { encryptedCredentials: "", success: false },
          StatusCodes.BAD_REQUEST
        );
      }

      // Get the AppKey encryption service
      const encryptionService = this.factory.getAppKeyEncryptionService();

      // Encrypt the Wise API key using the AppKey
      const encryptedCredentials = await encryptionService.encrypt(request.wiseApiKey);

      logger.info("Successfully encrypted credentials");

      return ServiceResponse.success("Credentials encrypted successfully", {
        encryptedCredentials,
        success: true
      });
    } catch (error) {
      const errorMessage = `Error encrypting credentials: ${(error as Error).message}`;
      logger.error(errorMessage);

      return ServiceResponse.failure(
        errorMessage,
        { encryptedCredentials: "", success: false },
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Verifies a payment by:
   * 1. Decrypting the provided encrypted API key
   * 2. Using the API key to fetch transactions from Wise
   * 3. Checking if the payment details match any transaction
   */
  async verifyPayment(request: VerifyPaymentRequest): Promise<ServiceResponse<VerifyPaymentResponse>> {
    try {
      logger.info("Verifying payment");

      // Validate the request data
      if (!request.encryptedCredentials) {
        return ServiceResponse.failure(
          "Missing encrypted credentials",
          { verified: false },
          StatusCodes.BAD_REQUEST
        );
      }

      if (!request.paymentDetails) {
        return ServiceResponse.failure(
          "Missing payment details",
          { verified: false },
          StatusCodes.BAD_REQUEST
        );
      }

      // Get the AppKey encryption service
      const encryptionService = this.factory.getAppKeyEncryptionService();

      // Decrypt the API key
      const wiseApiKey = await encryptionService.decrypt(request.encryptedCredentials);

      // Create a Wise API client
      const wiseClient = this.factory.createWiseApiClient();

      // Fetch transactions using the decrypted API key
      const transactions = await wiseClient.getTransactions(wiseApiKey);

      // Check if any transaction matches the payment details
      const matchingTransaction = this.findMatchingTransaction(
        transactions,
        request.paymentDetails
      );

      if (matchingTransaction) {
        logger.info("Payment verified successfully");

        // Generate a minimal quote with essential transaction details
        const quote = this.generateTransactionQuote(matchingTransaction);

        return ServiceResponse.success("Payment verified", {
          verified: true,
          quote
        });
      } else {
        logger.info("No matching transaction found");

        return ServiceResponse.success("Payment not verified", {
          verified: false,
          message: "No matching transaction found"
        });
      }
    } catch (error) {
      const errorMessage = `Error verifying payment: ${(error as Error).message}`;
      logger.error(errorMessage);

      return ServiceResponse.failure(
        errorMessage,
        { verified: false },
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Finds a transaction that matches the provided payment details
   */
  private findMatchingTransaction(
    transactions: any[],
    paymentDetails: VerifyPaymentRequest['paymentDetails']
  ): WiseApiTransaction | null {
    // Find a transaction that matches the reference, amount, and currency
    return transactions.find(tx =>
      tx.reference === paymentDetails.reference &&
      tx.amount === paymentDetails.amount &&
      tx.currency === paymentDetails.currency
    ) || null;
  }

  /**
   * Generates a minimal quote with essential transaction details
   */
  private generateTransactionQuote(transaction: WiseApiTransaction): string {
    // Create a minimal quote with essential details
    // This is returned to the caller as proof of verification
    const quoteData = {
      id: transaction.id,
      reference: transaction.reference,
      amount: transaction.amount,
      currency: transaction.currency,
      date: transaction.date,
      verifiedAt: new Date().toISOString()
    };

    return JSON.stringify(quoteData);
  }

  /**
   * Generates an RA report with optional user data
   */
  async generateRAReport(userData: string = ""): Promise<ServiceResponse<{ quote: string }>> {
    try {
      logger.info("Generating RA report");

      const quote = await this.factory.generateRAReport(userData);

      return ServiceResponse.success("RA report generated", {
        quote
      });
    } catch (error) {
      const errorMessage = `Error generating RA report: ${(error as Error).message}`;
      logger.error(errorMessage);

      return ServiceResponse.failure(
        errorMessage,
        { quote: "" },
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
} 