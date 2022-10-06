import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { IUser } from 'prisma/schema';
import { v4 as uuid } from 'uuid';
import argon2 from 'argon2';
import { aes_decode } from '@/src/util/auth/aes';

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } },
});

export interface ICreateUserReq {
  type: 'web3' | 'web2';
  payload: Web3UserCreate | Web2UserCreate;
}

export interface Web3UserCreate {
  username?: string;
  walletAddress: string;
}

export interface Web2UserCreate {
  username?: string;
  email: string;
  password: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const createUserReq: ICreateUserReq = JSON.parse(req.body);

  if (createUserReq.type === 'web3') {
    const userPayload = createUserReq.payload as Web3UserCreate;
    try {
      const user = await prisma.user.findFirst({
        where: {
          walletAddress: userPayload.walletAddress,
        },
      });

      if (user) {
        // User exists, return
        res.status(200).json({
          data: { userId: user.userId, username: user.username },
          message: `User with address '${userPayload.walletAddress}' already exists`,
          error: false,
        });
        return;
      } else {
        // Create user
        const id = uuid();
        const new_user = await prisma.user.create({
          data: {
            userId: id,
            username: userPayload.username ? userPayload.username : id,
            walletAddress: userPayload.walletAddress,
            createdAt: Math.floor(Date.now() / 1000),
            updatedAt: Math.floor(Date.now() / 1000),
          },
        });
        if (new_user) {
          res.status(201).json({
            data: { userId: new_user.userId, username: new_user.username },
            message: `User '${new_user.userId}' created with walletAddress: '${userPayload.walletAddress}'`,
            error: false,
          });
        } else {
          res.status(400).json({
            message: `User with walletAddress: '${userPayload.walletAddress}' failed to be created`,
            error: true,
          });
        }
      }
    } catch (e: any) {
      res
        .status(400)
        .json({ data: createUserReq, message: e.toString(), error: true });
    }
  } else {
    const userPayload = createUserReq.payload as Web2UserCreate;
    try {
      const user = await prisma.user.findFirst({
        where: {
          walletAddress: userPayload.email,
        },
      });

      if (user) {
        // User exists, return
        res.status(200).json({
          data: { userId: user.userId, username: user.username },
          message: `User with email '${userPayload.email}' already exists`,
          error: false,
        });
        return;
      } else {
        // Create user
        const id = uuid();
        const hashed_password = await argon2.hash(
          aes_decode(userPayload.password)
        );
        const new_user = await prisma.user.create({
          data: {
            userId: id,
            username: userPayload.username ? userPayload.username : id,
            email: userPayload.email,
            password: hashed_password,
            createdAt: Math.floor(Date.now() / 1000),
            updatedAt: Math.floor(Date.now() / 1000),
          },
        });
        if (new_user) {
          res.status(201).json({
            data: { userId: new_user.userId, username: new_user.username },
            message: `User '${new_user.userId}' created with email: '${userPayload.email}'`,
            error: false,
          });
        } else {
          res.status(400).json({
            message: `User with email: '${userPayload.email}' failed to be created`,
            error: true,
          });
        }
      }
    } catch (e: any) {
      res
        .status(400)
        .json({ data: createUserReq, message: e.toString(), error: true });
    }
  }

  // try {
  //   const user = await prisma.user.create({ data: userData });

  //   res.status(201).json({
  //     data: user,
  //     message: 'User successfully created',
  //     error: false,
  //   });
  // } catch (e: any) {
  //   res
  //     .status(400)
  //     .json({ data: userData, message: e.toString(), error: true });
  // }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb',
    },
  },
};
