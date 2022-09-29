import type { CoinbaseWallet } from '@web3-react/coinbase-wallet';
import type { Web3ReactHooks } from '@web3-react/core';
import { GnosisSafe } from '@web3-react/gnosis-safe';
import type { MetaMask } from '@web3-react/metamask';
import { Network } from '@web3-react/network';
import { WalletConnect } from '@web3-react/walletconnect';
import { useCallback, useState } from 'react';
import { CHAINS, getAddChainParameters, URLS } from './chains';
import { getName } from './utils';

export function Connect({
  connector,
  chainId,
  isActivating,
  isActive,
  error,
  setError,
}: {
  connector: MetaMask | WalletConnect | CoinbaseWallet | Network | GnosisSafe;
  chainId: ReturnType<Web3ReactHooks['useChainId']>;
  isActivating: ReturnType<Web3ReactHooks['useIsActivating']>;
  isActive: ReturnType<Web3ReactHooks['useIsActive']>;
  error: Error | undefined;
  setError: (error: Error | undefined) => void;
}) {
  const isNetwork = connector instanceof Network;
  const displayDefault = !isNetwork;
  const chainIds = (isNetwork ? Object.keys(URLS) : Object.keys(CHAINS)).map(
    chainId => Number(chainId)
  );

  const [desiredChainId, setDesiredChainId] = useState<number>(
    isNetwork ? 1 : -1
  );

  const switchChain = useCallback(
    (desiredChainId: number) => {
      setDesiredChainId(desiredChainId);
      // if we're already connected to the desired chain, return
      if (desiredChainId === chainId) {
        setError(undefined);
        return;
      }

      // if they want to connect to the default chain and we're already connected, return
      if (desiredChainId === -1 && chainId !== undefined) {
        setError(undefined);
        return;
      }

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
    },
    [connector, chainId, setError]
  );

  const onClick = useCallback((): void => {
    setError(undefined);
    if (connector instanceof GnosisSafe) {
      connector
        .activate()
        .then(() => setError(undefined))
        .catch(setError);
    } else if (
      connector instanceof WalletConnect ||
      connector instanceof Network
    ) {
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
        <button onClick={onClick}>{getName(connector).toLowerCase()}</button>
      </div>
    );
  } else if (isActive) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '1rem' }} />
        <button
          onClick={() => {
            if (connector?.deactivate) {
              void connector.deactivate();
            } else {
              void connector.resetState();
            }
          }}
        >
          {`Disconnect`}
        </button>
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
                  connector instanceof GnosisSafe
                    ? void connector
                        .activate()
                        .then(() => setError(undefined))
                        .catch(setError)
                    : connector instanceof WalletConnect ||
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
}
