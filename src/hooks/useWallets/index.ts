import { useConnectWallet } from '@/src/components/ConnectWallet/useConnectWallet';
import { useEffect, useState } from 'react';

export const useWallet = () => {
  const {
    connect: connect0,
    disconnect: disconnect0,
    accounts: accounts0,
    isActivating: isActivating0,
    isActive: isActive0,
    error: error0,
  } = useConnectWallet('metamask');

  const {
    connect: connect1,
    disconnect: disconnect1,
    accounts: accounts1,
    isActivating: isActivating1,
    isActive: isActive1,
    error: error1,
  } = useConnectWallet('coinbase wallet');

  const {
    connect: connect2,
    disconnect: disconnect2,
    accounts: accounts2,
    isActivating: isActivating2,
    isActive: isActive2,
    error: error2,
  } = useConnectWallet('walletconnect');

  const [connectedAddress, setConnectedAddress] = useState<string | undefined>(
    undefined
  );

  const [activeWallet, setActiveWallet] = useState<
    'metamask' | 'walletconnect' | 'coinbase wallet' | ''
  >('');

  useEffect(() => {
    if (isActive0 && accounts0) {
      setConnectedAddress(accounts0[0]);
      setActiveWallet('metamask');
    }
    if (isActive1 && accounts1) {
      setConnectedAddress(accounts1[0]);
      setActiveWallet('coinbase wallet');
    }
    if (isActive2 && accounts2) {
      setConnectedAddress(accounts2[0]);
      setActiveWallet('walletconnect');
    }
  }, [isActive0, isActive1, isActive2]);

  return {
    connectedAddress,
    activeWallet,
  };
};
