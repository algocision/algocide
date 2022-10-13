import { aes_encode } from './aes';

export interface ITokenParams {
  type: 'web2' | 'web3';
  userId: string;
  password: string;
  timeStamp: string | number;
}

export const createToken = (params: ITokenParams) => {
  return aes_encode(
    `${params.type}:${params.userId}:${params.password}:${params.timeStamp}`
  );
};
export default createToken;
