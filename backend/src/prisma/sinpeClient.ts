import { PrismaClient } from "@prisma/client";

const globalForSinpe = globalThis as unknown as { sinpe: PrismaClient | undefined };

const databaseUrl = process.env.DATABASE_URL_SINPE;
if (!databaseUrl) {
  throw new Error("DATABASE_URL_SINPE not found in environment variables");
}

export const sinpe =
  globalForSinpe.sinpe ??
  new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
    log: ['query', 'error', 'warn'],
  });

if (process.env.NODE_ENV !== "production") globalForSinpe.sinpe = sinpe;
