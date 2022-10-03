import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { IUser } from 'prisma/schema';

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } },
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userData: IUser = JSON.parse(req.body);

  try {
    const user = await prisma.user.findFirst({
      where: {
        walletAddress: userData.walletAddress,
      },
    });

    if (user) {
      res.status(200).json({
        data: { username: user.username, user: userData.userId },
        message: `User ${user.userId} found`,
        error: false,
      });
    } else {
      res.status(200).json({
        message: `No user with address '${userData.walletAddress}'`,
        error: false,
      });
    }
  } catch (e: any) {
    res
      .status(400)
      .json({ data: userData, message: e.toString(), error: true });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb',
    },
  },
};
