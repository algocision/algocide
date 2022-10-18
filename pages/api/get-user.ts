import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { IUser } from 'prisma/schema';
import { db } from '@/src/db/PrismaDB';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userData: IUser = JSON.parse(req.body);

  try {
    const user = await db.user.findFirst({
      where: {
        walletAddress: userData.walletAddress,
        email: userData.email,
      },
    });

    if (user) {
      res.status(200).json({
        data: { username: user.username, user: userData.userId },
        message: `User ${user.userId} found`,
        found: true,
        error: false,
      });
    } else {
      res.status(200).json({
        message: `No user found with ${userData.email ? 'email' : 'address'} '${
          userData.email ? userData.email : userData.walletAddress
        }'`,
        found: false,
        error: false,
      });
    }
  } catch (e: any) {
    res.status(400).json({
      data: userData,
      message: e.toString(),
      error: true,
      found: false,
    });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb',
    },
  },
};
