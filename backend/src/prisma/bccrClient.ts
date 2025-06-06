import { PrismaClient } from "../../prisma/generated/bccr/index";

const globalForBccr = globalThis as unknown as { bccr: PrismaClient | undefined };

const databaseUrl = process.env.DATABASE_URL_BCCR;
if (!databaseUrl) {
  throw new Error("DATABASE_URL_BCCR not found in environment variables");
}

export const bccr =
  globalForBccr.bccr ??
  new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
    log: ['query', 'error', 'warn'],
  });

if (process.env.NODE_ENV !== "production") globalForBccr.bccr = bccr;
