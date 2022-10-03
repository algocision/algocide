import { ethers } from 'ethers';
import { aes_decode, aes_encode } from '@/src/util/auth/aes';
import verifyMessage from '@/src/util/auth/verifyMessage';

export const verify = async (
  signer: ethers.providers.JsonRpcSigner,
  connectedAddress: string
): Promise<boolean> => {
  let verified = false;

  const message = 'Signature required to securely store user data';
  let sig = localStorage.getItem(aes_encode('signature'));

  if (sig === null) {
    try {
      const raw_sig = await signer.signMessage(message);
      sig = aes_encode(raw_sig);
    } catch (err) {
      // console.log(`User denied signature`);
    }
  }

  if (sig !== 'null' && sig !== null) {
    verified = verifyMessage(message, connectedAddress, aes_decode(sig));
    if (verified) {
      localStorage.setItem(aes_encode('signature'), sig);
    } else {
      localStorage.removeItem(aes_encode('signature'));
      return verify(signer, connectedAddress);
    }
  }
  return verified;
};

export default verify;
