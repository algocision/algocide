import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { IEntry } from 'prisma/schema';
import { IEntryReadOptions } from '@/src/db/read/readEntries';

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } },
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { amount }: IEntryReadOptions = req.query;

  try {
    const entries: IEntry[] = await prisma.entry.findMany({
      take: amount ? parseInt(amount.toString()) : 100,
    });
    res.status(200).json(entries);
  } catch (e: any) {
    res.status(400).json(e.toString());
  }
}
