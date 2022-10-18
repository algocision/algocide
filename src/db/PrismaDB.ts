import { PrismaClient } from '@prisma/client';

let db = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } },
});

export { db };
