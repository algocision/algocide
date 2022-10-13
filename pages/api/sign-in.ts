import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { IUser } from 'prisma/schema';
import argon2 from 'argon2';
import { aes_decode, aes_encode } from '@/src/util/auth/aes';
import createToken from '@/src/util/auth/createToken';

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } },
});

export interface SignInRes {
  message: string;
  token: string;
  error: boolean;
}

export interface ICreateUserReq {
  type: 'web3' | 'web2';
  payload: Web3UserSignIn | Web2UserSignIn;
}

export interface Web3UserSignIn {
  username?: string;
  walletAddress: string;
}

export interface Web2UserSignIn {
  username?: string;
  email: string;
  password: string;
  token: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SignInRes>
) {
  const userData: ICreateUserReq = JSON.parse(req.body);

  try {
    const user = await prisma.user.findFirst({
      where:
        userData.type === 'web3'
          ? {
              walletAddress: (userData.payload as Web3UserSignIn).walletAddress,
            }
          : {
              email: (userData.payload as Web2UserSignIn).email,
            },
    });

    if (!user) {
      res.status(400).json({
        message: `User not found`,
        token: '',
        error: true,
      });
      return;
    }

    if (userData.type === 'web3') {
      res.status(400).json({
        token: '',
        message: 'Web3 login not yet implemented',
        error: true,
      });
      return;
    }
    // Else web2
    const delay =
      Date.now() -
      parseInt(aes_decode((userData.payload as Web2UserSignIn).token));
    if (delay > 6000) {
      res.status(400).json({
        token: '',
        message: `Sign in attempt took too long try again (${delay}ms)`,
        error: true,
      });
      return;
    }
    const verify = await argon2.verify(
      user.password as string,
      aes_decode((userData.payload as Web2UserSignIn).password)
    );
    if (verify) {
      res.status(200).json({
        token: createToken({
          type: 'web2',
          userId: user.userId,
          password: aes_decode((userData.payload as Web2UserSignIn).password),
          timeStamp: aes_decode((userData.payload as Web2UserSignIn).token),
        }),
        message: 'Successfully logged in',
        error: false,
      });
      return;
    }

    res.status(400).json({
      token: '',
      message: 'Invalid password',
      error: true,
    });
  } catch (e: any) {
    res.status(400).json({
      token: '',
      message: 'Internal server error',
      error: true,
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
