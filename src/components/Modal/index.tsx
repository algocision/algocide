import Frame from './_core/Frame';
import styles from './index.module.css';
import { useEffect, useState } from 'react';
import { UseConnect } from '../ConnectWallet/useConnect';
import {
  hooks as metaMaskHooks,
  metaMask,
} from '../ConnectWallet/connectors/metaMask';
import {
  coinbaseWallet,
  hooks as coinbaseWalletHooks,
} from '../ConnectWallet/connectors/coinbaseWallet';
import {
  hooks as walletConnectHooks,
  walletConnect,
} from '../ConnectWallet/connectors/walletConnect';

interface Props {
  modalActive: boolean;
  setModalActive: React.Dispatch<React.SetStateAction<boolean>>;
  setCursorPointer: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedNavIndex: React.Dispatch<React.SetStateAction<number>>;
  setSubNavIndex: React.Dispatch<React.SetStateAction<number>>;
  selectedNavIndex: number;
  subNavIndex: number;
  activeBlink: boolean;
  subNavItems: Record<number, string[]>;
  navItems: string[];
}
export const Modal: React.FC<Props> = ({
  modalActive,
  setModalActive,
  setCursorPointer,
  setSelectedNavIndex,
  selectedNavIndex,
  setSubNavIndex,
  subNavIndex,
  activeBlink,
  subNavItems,
  navItems,
}) => {
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

  // Reset indices on close
  useEffect(() => {
    if (!modalActive) {
      setSelectedNavIndex(0);
      setSubNavIndex(0);
    }
  }, [modalActive]);

  return (
    <>
      {modalActive && (
        <Frame
          loading={false}
          header={navItems[selectedNavIndex]}
          setIsOpen={setModalActive}
          setCursorPointer={setCursorPointer}
          content={
            <>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {subNavItems[selectedNavIndex].map(
                  (item: string, index: number) => {
                    return item === 'metamask' ||
                      item === 'coinbase wallet' ||
                      item === 'walletconnect' ? (
                      // <UseConnect />
                      <></>
                    ) : (
                      <div
                        key={item}
                        style={{ display: 'flex', flexDirection: 'column' }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            width: `150px`,
                            padding: 10,
                          }}
                          onMouseEnter={() => {
                            setCursorPointer(true);
                          }}
                          onMouseLeave={() => {
                            setCursorPointer(false);
                          }}
                          onClick={() => {
                            if (item === 'connect wallet') {
                              setSubNavIndex(0);
                              setSelectedNavIndex(2);
                              setCursorPointer(false);
                              return;
                            }
                            setSubNavIndex(index);
                            setCursorPointer(false);
                          }}
                        >
                          {subNavIndex === index && (
                            <div
                              className={styles.navItem}
                              style={{ marginRight: 6, marginLeft: -14 }}
                            >
                              {`>`}
                            </div>
                          )}
                          <div className={styles.navItem}>{item}</div>
                          {subNavIndex === index && (
                            <div className={styles.navItem}>
                              {activeBlink ? '_' : ''}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </>
          }
        />
      )}
    </>
  );
};

export default Modal;
