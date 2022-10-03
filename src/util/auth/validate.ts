import { ethers } from 'ethers';
import { aes_decode } from './aes';

export const validate = (encoded_token?: string) => {
  if (!encoded_token) {
    return { error: true, message: 'Token required', address: null };
  }

  const token = aes_decode(encoded_token);

  const [address, signature, timestamp] = token.split(':');

  const time_elapsed = (Date.now() - parseInt(timestamp)) / 1000;

  if (time_elapsed > 15) {
    return {
      error: true,
      message: 'Token expired try again',
      address: address,
    };
  }

  try {
    const signer_address = ethers.utils.verifyMessage(
      'Signature required to securely store user data',
      signature
    );
    if (signer_address !== address) {
      return { error: true, message: 'Invalid signature', address: address };
    } else {
      return { error: false, message: 'Signature valid', address: address };
    }
  } catch (err: any) {
    return {
      error: true,
      message: `Error verifying signature (${err.toString()})`,
      address: address,
    };
  }
};
