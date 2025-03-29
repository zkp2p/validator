import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";
import { StatusCodes } from "http-status-codes";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { handleServiceResponse } from "@/common/utils/httpHandlers";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { validatorController } from "./validatorController";
import {
  EncryptRequestSchema,
  EncryptResponseSchema,
  VerifyPaymentRequestSchema,
  VerifyPaymentResponseSchema,
} from "./validatorModel";

export const validatorRegistry = new OpenAPIRegistry();
export const validatorRouter: Router = express.Router();

// Register POST /validator/encrypt endpoint
validatorRegistry.registerPath({
  method: "post",
  path: "/validator/encrypt",
  tags: ["Validator"],
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        "application/json": {
          schema: EncryptRequestSchema,
        },
      },
    },
  },
  responses: createApiResponse(EncryptResponseSchema, "Success"),
});

// Register POST /validator/verify-payment endpoint
validatorRegistry.registerPath({
  method: "post",
  path: "/validator/verify-payment",
  tags: ["Validator"],
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        "application/json": {
          schema: VerifyPaymentRequestSchema,
        },
      },
    },
  },
  responses: createApiResponse(VerifyPaymentResponseSchema, "Success"),
});

// Register POST /validator/ra-report endpoint
validatorRegistry.registerPath({
  method: "post",
  path: "/validator/ra-report",
  tags: ["Validator"],
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            userData: z.string().optional(),
          }),
        },
      },
    },
  },
  responses: createApiResponse(z.object({
    quote: z.string(),
  }), "Success"),
});

// Setup routes
validatorRouter.post("/encrypt", validatorController.encryptCredentials);
validatorRouter.post("/verify-payment", validatorController.verifyPayment);
validatorRouter.post("/ra-report", validatorController.generateRAReport); 