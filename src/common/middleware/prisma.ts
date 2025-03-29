import { PrismaClient } from "@prisma/client";

declare global {
  namespace NodeJS {
    interface Global {
      prisma: PrismaClient;
    }
  }
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  // console.log("Initializing Prisma client for production environment");

  prisma = new PrismaClient();
} else if (process.env.NODE_ENV === "test") {
  // console.log("Initializing Prisma client for test environment");

  prisma = new PrismaClient({
    datasources: { db: { url: "postgresql://zkp2p_user:zkp2p_password@localhost:5432/zkp2p_test?schema=public" } },
  });
} else {
  // console.log("Initializing Prisma client for dev environment");

  if (!(globalThis as any).prisma) {
    (globalThis as any).prisma = new PrismaClient();
  }
  prisma = (globalThis as any).prisma;
}

export default prisma;
