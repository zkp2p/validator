import { StatusCodes } from "http-status-codes";
import { logger } from "@/server";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { ValidatorFactory, WiseFormattedTransaction } from "./validatorFactory";
import {
  EncryptRequest,
  EncryptResponse,
  VerifyPaymentRequest,
  VerifyPaymentResponse,
  WisePaymentDetailsRequest
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

      const encryptionService = this.factory.getAppKeyEncryptionService();
      const { encryptedData, encryptionIV } = await encryptionService.encrypt(request.wiseApiKey);

      logger.info("Successfully encrypted credentials");

      return ServiceResponse.success("Credentials encrypted successfully", {
        encryptedCredentials: encryptedData,
        encryptionIV: encryptionIV,
        success: true
      });
    } catch (error) {
      const errorMessage = `Error encrypting credentials: ${(error as Error).message}`;
      logger.error(errorMessage);

      return ServiceResponse.failure(
        errorMessage,
        { encryptedCredentials: "", encryptionIV: "", success: false },
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
      logger.debug("Logger level debug test");
      logger.info("Logger level info test");
      logger.warn("Logger level warn test");

      logger.info("Verifying payment");

      const encryptionService = this.factory.getAppKeyEncryptionService();
      const wiseApiKey = await encryptionService.decrypt(request.encryptedCredentials, request.encryptionIV);
      const wiseClient = this.factory.createWiseApiClient();
      const transactions = await wiseClient.getTransactions(wiseApiKey);

      // Check if any transaction matches the payment details
      logger.info("Using Wise payment details for verification");
      const matchingTransaction = this.findMatchingTransaction(transactions, request.wisePaymentDetails);

      if (matchingTransaction) {
        logger.info("Payment verified successfully");

        const quote = this.generateTransactionQuote(matchingTransaction);
        const quoteString = JSON.stringify(quote);
        const raReport = await this.generateRAReport(quoteString);
        return ServiceResponse.success("Payment verified", {
          verified: true,
          quote: quoteString,
          raReport
        });
      } else {
        logger.info("No matching transaction found");
        return ServiceResponse.success("Payment not verified", {
          verified: false,
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
   * Finds a transaction that matches the provided Wise payment details
   */
  private findMatchingTransaction(
    transactions: WiseFormattedTransaction[],
    wiseDetails: WisePaymentDetailsRequest
  ): WiseFormattedTransaction | null {
    if (!wiseDetails) return null;

    logger.info("Looking for COMPLETED received transaction matching the payment details");

    // Parse the expected amount to a number for comparison
    const expectedAmount = parseFloat(wiseDetails.amount);
    const expectedTimestamp = new Date(wiseDetails.timestamp).getTime();
    const expectedCurrency = wiseDetails.currency;
    const expectedStatus = wiseDetails.paymentStatus ? wiseDetails.paymentStatus : 'COMPLETED';
    const expectedType = 'received';
    if (isNaN(expectedAmount)) {
      logger.warn(`Invalid amount format in request: ${wiseDetails.amount}`);
      return null;
    }

    logger.info(`Expected amount: ${expectedAmount}`);


    // Find a transaction that matches the Wise payment details
    const matchingTransaction = transactions.find(tx => {

      // Return all comparisons for debugging
      const statusMatch = tx.status === expectedStatus;
      const typeMatch = tx.type === expectedType;
      const currencyMatch = tx.currency === expectedCurrency;
      const amountMatch = Number(tx.amount) >= expectedAmount;
      const timestampMatch = new Date(tx.date).getTime() >= expectedTimestamp;

      // Log all comparison values
      logger.info(`Comparing transaction:
        Expected status: ${expectedStatus}, Actual status: ${tx.status}, Status match: ${statusMatch}
        Expected type: ${expectedType}, Actual type: ${tx.type}, Type match: ${typeMatch}
        Expected currency: ${expectedCurrency}, Actual currency: ${tx.currency}, Currency match: ${currencyMatch}
        Expected minimum amount: ${expectedAmount}, Actual amount: ${tx.amount}, Amount match: ${amountMatch}
        Expected minimum timestamp: ${expectedTimestamp}, Actual timestamp: ${new Date(tx.date).getTime()}, Timestamp match: ${timestampMatch}`);

      // Return the actual comparison result
      return statusMatch && typeMatch && currencyMatch && amountMatch && timestampMatch;
    });

    if (!matchingTransaction) {
      return null;
    }

    logger.info("Found matching transaction");

    // Transform to WisePaymentDetailsResponse
    return {
      paymentId: matchingTransaction.paymentId,
      amount: matchingTransaction.amount.toString(),
      currency: matchingTransaction.currency,
      date: matchingTransaction.date,
      status: matchingTransaction.status,
      recipientId: matchingTransaction.recipientId,
      type: matchingTransaction.type
    };
  }

  /**
   * Generates a minimal quote with essential transaction details
   */
  private generateTransactionQuote(transaction: WiseFormattedTransaction) {
    return {
      platform: "wise",
      paymentId: transaction.paymentId,
      amount: transaction.amount,
      currency: transaction.currency,
      date: transaction.date,
      status: transaction.status,
      recipientId: transaction.recipientId,
      verifiedAt: new Date().toISOString()
    };
  }

  /**
   * Generates an RA report with optional user data
   * @private
   */
  private async generateRAReport(userData: string = ""): Promise<string> {
    try {
      logger.info("Generating RA report");
      return await this.factory.generateRAReport(userData);
    } catch (error) {
      logger.error(`Error generating RA report: ${(error as Error).message}`);
      return JSON.stringify({
        error: `RA report generation failed: ${(error as Error).message}`,
        timestamp: new Date().toISOString()
      });
    }
  }
} 