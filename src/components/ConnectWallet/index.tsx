import { hooks as metaMaskHooks, metaMask } from './connectors/metaMask';
import {
  coinbaseWallet,
  hooks as coinbaseWalletHooks,
} from './connectors/coinbaseWallet';
import {
  hooks as walletConnectHooks,
  walletConnect,
} from './connectors/walletConnect';
import Provider from './Provider';
import { useState } from 'react';
import { Connect } from './Connect';
import { UseConnect } from './useConnect';

export const ConnectWallet = () => {
  const {
    useChainId: useChainId0,
    useAccounts: useAccounts0,
    useIsActivating: useIsActivating0,
    useIsActive: useIsActive0,
    useProvider: useProvider0,
    useENSNames: useENSNames0,
  } = metaMaskHooks;
  const {
    useChainId: useChainId1,
    useAccounts: useAccounts1,
    useIsActivating: useIsActivating1,
    useIsActive: useIsActive1,
    useProvider: useProvider1,
    useENSNames: useENSNames1,
  } = coinbaseWalletHooks;
  const {
    useChainId: useChainId2,
    useAccounts: useAccounts2,
    useIsActivating: useIsActivating2,
    useIsActive: useIsActive2,
    useProvider: useProvider2,
    useENSNames: useENSNames2,
  } = walletConnectHooks;

  const chainId0 = useChainId0();
  const accounts0 = useAccounts0();
  const isActivating0 = useIsActivating0();

  const isActive0 = useIsActive0();

  const provider0 = useProvider0();
  const ENSNames0 = useENSNames0(provider0);

  const [error0, setError0] = useState<Error | undefined>(undefined);

  const chainId1 = useChainId1();
  const accounts1 = useAccounts1();
  const isActivating1 = useIsActivating1();

  const isActive1 = useIsActive1();

  const provider1 = useProvider1();
  const ENSNames1 = useENSNames1(provider1);

  const [error1, setError1] = useState<Error | undefined>(undefined);

  const chainId2 = useChainId2();
  const accounts2 = useAccounts2();
  const isActivating2 = useIsActivating2();

  const isActive2 = useIsActive2();

  const provider2 = useProvider2();
  const ENSNames2 = useENSNames2(provider2);

  const [error2, setError2] = useState<Error | undefined>(undefined);

  return (
    <>
      <Provider />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',

          fontFamily: 'sans-serif',
        }}
      >
        <UseConnect
          connector={metaMask}
          isActivating={isActivating0}
          isActive={isActive0}
          error={error0}
          setError={setError0}
        />
        {/* <Connect
          connector={metaMask}
          chainId={chainId0}
          isActivating={isActivating0}
          isActive={isActive0}
          error={error0}
          setError={setError0}
        /> */}
        <Connect
          connector={coinbaseWallet}
          chainId={chainId1}
          isActivating={isActivating1}
          isActive={isActive1}
          error={error1}
          setError={setError1}
        />
        <Connect
          connector={walletConnect}
          chainId={chainId2}
          isActivating={isActivating2}
          isActive={isActive2}
          error={error2}
          setError={setError2}
        />
      </div>
    </>
  );
};

export default ConnectWallet;
