import { aes_decode } from '@/src/util/auth/aes';
import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import argon2 from 'argon2';
import createToken from '@/src/util/auth/createToken';

export interface RefreshRes {
  valid: boolean;
  updated_token: string;
  message: string;
  age: number;
}

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } },
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RefreshRes>
) {
  const token = JSON.parse(req.body).token;
  const now = Date.now();
  if (!token) {
    res
      .status(400)
      .json({
        valid: false,
        updated_token: '',
        message: 'No token provided',
        age: -1,
      });
    return;
  }

  const decoded_token = aes_decode(token);
  const [type, id, password, timestamp] = decoded_token.split(':');

  const user = await prisma.user.findUnique({
    where: {
      userId: id,
    },
  });

  if (!user) {
    res.status(400).json({
      valid: false,
      updated_token: '',
      message: 'No user found for provided token',
      age: now - parseInt(timestamp),
    });
    return;
  }

  const verify = await argon2.verify(
    user.password ? user.password : '',
    password
  );

  if (verify) {
    res.status(200).json({
      updated_token: createToken({
        type: 'web2',
        userId: id,
        password: password,
        timeStamp: Date.now(),
      }),
      valid: true,
      message: 'Successfully updated token',
      age: now - parseInt(timestamp),
    });
    return;
  }

  res.status(400).json({
    updated_token: '',
    message: 'Invalid password',
    valid: false,
    age: now - parseInt(timestamp),
  });
}
