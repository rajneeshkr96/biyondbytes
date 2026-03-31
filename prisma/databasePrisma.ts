import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined
}


if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

export const dataBasePrisma = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV === 'development') globalThis.prisma = dataBasePrisma;
