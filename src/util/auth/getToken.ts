import { aes_decode, aes_encode } from './aes';

export const getToken = (address: string) => {
  const signature = localStorage.getItem(aes_encode('signature'));
  return aes_encode(
    `${address}:${aes_decode(signature ? signature : '')}:${Date.now()}`
  );
};
export default getToken;
