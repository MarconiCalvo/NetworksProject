// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Usa singleton en desarrollo para evitar múltiples instancias
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL_SINPE,
      },
    },
    log: ["query", "error", "warn"], // Opcional: elimina si no querés logs
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
