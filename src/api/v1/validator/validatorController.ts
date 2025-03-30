import { ServiceResponse } from "@/common/models/serviceResponse";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import type { Request, RequestHandler, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ValidatorService } from "./validatorService";

export class ValidatorController {
  private service: ValidatorService;

  constructor(service: ValidatorService = new ValidatorService()) {
    this.service = service;
  }

  /**
   * Encrypts sensitive credentials (e.g., Wise API key) using the TEE's AppKey
   */
  public encryptCredentials: RequestHandler = async (req: Request, res: Response) => {
    try {
      const encryptRequest = req.body;

      // Validate request data
      if (!encryptRequest || !encryptRequest.wiseApiKey) {
        const serviceResponse = ServiceResponse.failure(
          "Missing required API key",
          { encryptedCredentials: "", encryptionIV: "", success: false },
          StatusCodes.BAD_REQUEST
        );
        return handleServiceResponse(serviceResponse, res);
      }

      // Call service to encrypt credentials
      const serviceResponse = await this.service.encryptCredentials(encryptRequest);
      return handleServiceResponse(serviceResponse, res);
    } catch (error) {
      const errorMessage = `Error processing encryption request: ${(error as Error).message}`;
      const serviceResponse = ServiceResponse.failure(
        errorMessage,
        { encryptedCredentials: "", encryptionIV: "", success: false },
        StatusCodes.INTERNAL_SERVER_ERROR
      );
      return handleServiceResponse(serviceResponse, res);
    }
  };

  /**
   * Verifies a payment by decrypting credentials and checking Wise transactions
   */
  public verifyPayment: RequestHandler = async (req: Request, res: Response) => {
    try {
      const verifyRequest = req.body;

      // Validate request data
      if (!verifyRequest || !verifyRequest.encryptedCredentials) {
        const serviceResponse = ServiceResponse.failure(
          "Missing encrypted credentials",
          { verified: false },
          StatusCodes.BAD_REQUEST
        );
        return handleServiceResponse(serviceResponse, res);
      }

      // Validate encryption IV is present
      if (!verifyRequest.encryptionIV) {
        const serviceResponse = ServiceResponse.failure(
          "Missing encryption initialization vector (IV)",
          { verified: false },
          StatusCodes.BAD_REQUEST
        );
        return handleServiceResponse(serviceResponse, res);
      }

      // Validate required Wise payment details
      if (!verifyRequest.wisePaymentDetails) {
        const serviceResponse = ServiceResponse.failure(
          "Missing Wise payment details",
          { verified: false },
          StatusCodes.BAD_REQUEST
        );
        return handleServiceResponse(serviceResponse, res);
      }

      const { amount, currency, timestamp } = verifyRequest.wisePaymentDetails;

      // All fields are required for Wise payment details
      if (!amount || !currency || !timestamp) {
        const serviceResponse = ServiceResponse.failure(
          "Missing required Wise payment details. All fields (recipientId, amount, currency, timestamp) are required",
          { verified: false },
          StatusCodes.BAD_REQUEST
        );
        return handleServiceResponse(serviceResponse, res);
      }

      // Call service to verify payment
      const serviceResponse = await this.service.verifyPayment(verifyRequest);
      return handleServiceResponse(serviceResponse, res);
    } catch (error) {
      const errorMessage = `Error processing payment verification request: ${(error as Error).message}`;
      const serviceResponse = ServiceResponse.failure(
        errorMessage,
        { verified: false },
        StatusCodes.INTERNAL_SERVER_ERROR
      );
      return handleServiceResponse(serviceResponse, res);
    }
  };
}

export const validatorController = new ValidatorController(); 