import CoinbaseWalletCard from './connectorCards/CoinbaseWalletCard';
import GnosisSafeCard from './connectorCards/GnosisSafeCard';
import MetaMaskCard from './connectorCards/MetaMaskCard';
import NetworkCard from './connectorCards/NetworkCard';
import WalletConnectCard from './connectorCards/WalletConnectCard';
import { hooks as metaMaskHooks } from './connectors/metaMask';
import { hooks as coinbaseWalletHooks } from './connectors/coinbaseWallet';
import { hooks as walletConnectHooks } from './connectors/walletConnect';
import ProviderExample from './ProviderExample';

export const ConnectWalletDev = () => {
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

  return (
    <>
      <ProviderExample />
      <div
        style={{
          display: 'flex',
          flexFlow: 'wrap',
          fontFamily: 'sans-serif',
        }}
      >
        {/* <MetaMaskCard />
        <WalletConnectCard />
        <CoinbaseWalletCard /> */}
      </div>
    </>
  );
};

export default ConnectWalletDev;
