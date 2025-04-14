import { PrismaClient } from "../generated/prisma";
/*
declare global {
  // eslint-disable-next-line no-unused-vars
  var db: PrismaClient | undefined;
}
*/
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const db = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
