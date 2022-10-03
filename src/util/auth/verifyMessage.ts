import { ethers } from 'ethers';

const verifyMessage = (
  message: string,
  address: string,
  signature: string
): boolean => {
  try {
    const signer_address = ethers.utils.verifyMessage(message, signature);
    if (signer_address !== address) {
      return false;
    }
    return true;
  } catch (err: any) {
    console.log('Error verifying message:', err.toString());
    return false;
  }
};

export default verifyMessage;
