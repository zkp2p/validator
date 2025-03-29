import { healthCheckRegistry, healthCheckRouter } from "@/api/v1/healthCheck/healthCheckRouter";
import { validatorRegistry, validatorRouter } from "@/api/v1/validator/validatorRouter";
import { createHybridAuthMiddleware } from "@/common/middleware/hybridAuth";
import { env } from "@/common/utils/envConfig";

import { Router } from "express";
import type { NextFunction, Request, Response } from "express";

const v1Router = Router();

v1Router.use("/health-check", healthCheckRouter);

const authMiddleware = env.DISABLE_JWT_AUTH
  ? (req: Request, res: Response, next: NextFunction) => next()
  : createHybridAuthMiddleware;

v1Router.use("/validator", authMiddleware, validatorRouter);

const v1Registry = [
  validatorRegistry,
];

export { v1Router, v1Registry };
