import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { IEntry } from 'prisma/schema';

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } },
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const entryData: IEntry[] = JSON.parse(req.body);

  try {
    await prisma.entry.createMany({ data: entryData, skipDuplicates: true });

    res.status(201).json({
      data: entryData,
      message: 'Entry successfully saved',
      error: false,
    });
  } catch (e: any) {
    res
      .status(400)
      .json({ data: entryData, message: e.toString(), error: true });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb',
    },
  },
};
