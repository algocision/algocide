import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { IEntry, ValueTypes } from 'prisma/schema';
import { IEntryUpdateOptions } from '@/src/db/update/updateEntries';

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } },
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const entryData: IEntryUpdateOptions = JSON.parse(req.body);

  const from: Record<string, ValueTypes> = {};
  Object.keys(entryData.where).map((key: string) => {
    from[key] = entryData.where[key];
  });

  const to: Record<string, ValueTypes> = {};
  Object.keys(entryData.data).map((key: string) => {
    to[key] = entryData.data[key];
  });

  try {
    const response_count = await prisma.entry.updateMany({
      where: { ...from },
      data: { ...to },
    });

    if (response_count.count === 0) {
      res.status(200).json({
        data: entryData,
        message: `${response_count.count} Entries successfully updated`,
        error: false,
      });
      return;
    }
    res.status(201).json({
      data: entryData,
      message: `${
        response_count.count === 1 ? 'Entry' : `${response_count.count} Entries`
      } successfully updated`,
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
