import { CoinbaseWallet } from '@web3-react/coinbase-wallet';
import { Web3ReactHooks } from '@web3-react/core';
import { GnosisSafe } from '@web3-react/gnosis-safe';
import { MetaMask } from '@web3-react/metamask';
import { Network } from '@web3-react/network';
import { WalletConnect } from '@web3-react/walletconnect';
import { useCallback, useState } from 'react';
import { getAddChainParameters } from './chains';
import { getName } from './utils';

interface IConnectHookProps {
  connector: MetaMask | WalletConnect | CoinbaseWallet | Network | GnosisSafe;
  isActivating: ReturnType<Web3ReactHooks['useIsActivating']>;
  isActive: ReturnType<Web3ReactHooks['useIsActive']>;
  error: Error | undefined;
  setError: (error: Error | undefined) => void;
}

export const UseConnect: React.FC<IConnectHookProps> = ({
  connector,
  isActivating,
  isActive,
  error,
  setError,
}: IConnectHookProps) => {
  const isNetwork = connector instanceof Network;
  const [desiredChainId, setDesiredChainId] = useState<number>(
    isNetwork ? 1 : -1
  );

  const connectAttempt = useCallback((): void => {
    setError(undefined);
    if (connector instanceof WalletConnect || connector instanceof Network) {
      connector
        .activate(desiredChainId === -1 ? undefined : desiredChainId)
        .then(() => setError(undefined))
        .catch(setError);
    } else {
      connector
        .activate(
          desiredChainId === -1
            ? undefined
            : getAddChainParameters(desiredChainId)
        )
        .then(() => setError(undefined))
        .catch(setError);
    }
  }, [connector, desiredChainId, setError]);

  if (error) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '1rem' }} />
        <button onClick={connectAttempt}>
          {getName(connector).toLowerCase()}
        </button>
      </div>
    );
  } else if (isActive) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '1rem' }} />
        <div
          onClick={() => {
            if (connector?.deactivate) {
              void connector.deactivate();
            } else {
              void connector.resetState();
            }
          }}
        >
          {`disconnect`}
        </div>
      </div>
    );
  } else {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '1rem' }} />
        <button
          onClick={
            isActivating
              ? undefined
              : () =>
                  connector instanceof WalletConnect ||
                  connector instanceof Network
                    ? connector
                        .activate(
                          desiredChainId === -1 ? undefined : desiredChainId
                        )
                        .then(() => setError(undefined))
                        .catch(setError)
                    : connector
                        .activate(
                          desiredChainId === -1
                            ? undefined
                            : getAddChainParameters(desiredChainId)
                        )
                        .then(() => setError(undefined))
                        .catch(setError)
          }
          disabled={isActivating}
        >
          {getName(connector).toLowerCase()}
        </button>
      </div>
    );
  }
};
