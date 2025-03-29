import crypto from "node:crypto";
import prisma from "@/common/middleware/prisma";
import { getJwtVerificationOptions } from "@/common/utils/jwtVerificationConfig";
import type { NextFunction, Request, Response } from "express";
import { jwtVerify } from "jose";

declare module "express" {
  interface Request {
    user?: {
      id: string | null;
      authMethod: "apiKey" | "jwt";
    };
  }
}

/**
 * Hybrid Authentication Middleware.
 * Checks for an API key in the x-api-key header.
 * If found, it validates the key by hashing and checking against the database.
 * If no API key is provided, it falls back to JWT authentication.
 */
export async function createHybridAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const apiKeyHeader = req.headers["x-api-key"];
    if (apiKeyHeader && typeof apiKeyHeader === "string") {
      const hashedKey = crypto.createHash("sha256").update(apiKeyHeader).digest("hex");
      const apiKeyRecord = await prisma.apiKey.findUnique({
        where: { keyHash: hashedKey },
      });

      if (!apiKeyRecord || apiKeyRecord.revoked) {
        return res.status(401).json({ error: "Invalid API key" });
      }

      req.user = { id: apiKeyRecord.userId, authMethod: "apiKey" };
      return next();
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "Missing Authorization header" });
    }

    const [scheme, token] = authHeader.split(" ");
    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ error: "Invalid Authorization header format" });
    }

    const { verificationKey, issuer, audience } = await getJwtVerificationOptions(token);
    await jwtVerify(token, verificationKey, { issuer, audience });
    return next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
