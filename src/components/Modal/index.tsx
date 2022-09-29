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
import { useConnectWallet } from '../ConnectWallet/useConnectWallet';

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
  // Reset indices on close
  useEffect(() => {
    if (!modalActive) {
      setSelectedNavIndex(0);
      setSubNavIndex(0);
    }
  }, [modalActive]);

  const {
    connect: connect0,
    disconnect: disconnect0,
    accounts: accounts0,
    isActivating: isActivating0,
    isActive: isActive0,
    error: error0,
  } = useConnectWallet('metamask');

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
                          <div
                            className={styles.navItem}
                            onClick={() => {
                              if (item === 'metamask') {
                                isActive0 ? disconnect0() : connect0();
                              }
                            }}
                          >
                            {isActive0 ? accounts0 : item}
                          </div>
                          {subNavIndex === index && (
                            <div className={styles.navItem}>
                              {activeBlink ? '_' : ''}
                            </div>
                          )}
                        </div>
                      </div>
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
