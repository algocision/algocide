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
import { MENU, MenuId, MenuOpt } from '@/src/util/menuTraverse';

interface Props {
  modalActive: boolean;
  setModalActive: React.Dispatch<React.SetStateAction<boolean>>;
  menuId: MenuId;
  setMenuId: React.Dispatch<React.SetStateAction<MenuId>>;
  selectedNavIndex: number;
  setSelectedNavIndex: React.Dispatch<React.SetStateAction<number>>;
  activeBlink: boolean;
  setCursorPointer: React.Dispatch<React.SetStateAction<boolean>>;
  engageItem: (el: MenuOpt) => boolean;
}

export const Modal: React.FC<Props> = ({
  modalActive,
  setModalActive,
  activeBlink,
  setCursorPointer,
  menuId,
  setMenuId,
  setSelectedNavIndex,
  selectedNavIndex,
  engageItem,
}) => {
  // Reset indices on close
  useEffect(() => {
    if (!modalActive) {
      setMenuId('-1');
      setSelectedNavIndex(0);
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

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 5)}...${address.slice(
      address.length - 5,
      address.length
    )}`;
  };

  const getMenuText = (item: MenuOpt) => {
    if (
      item !== 'metamask' &&
      item !== 'coinbase wallet' &&
      item !== 'walletconnect'
    ) {
      return item;
    }

    if (item === 'metamask') {
      if (isActive0) {
        return accounts0 && shortenAddress(accounts0[0]);
      }
      return 'metamask';
    }
    if (item === 'coinbase wallet') {
      if (isActive1) {
        return accounts1 && shortenAddress(accounts1[0]);
      }
      return 'coinbase wallet';
    }
    if (item === 'walletconnect') {
      if (isActive2) {
        return accounts2 && shortenAddress(accounts2[0]);
      }
      return 'walletconnect';
    }
  };

  return (
    <>
      {modalActive && (
        <Frame
          loading={false}
          header={menuId[0] === '0' ? 'connect' : 'explore'}
          setIsOpen={setModalActive}
          setCursorPointer={setCursorPointer}
          content={
            <>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {MENU[menuId].map((item: MenuOpt, index: number) => {
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
                          if (!engageItem(item)) {
                            setSelectedNavIndex(index);
                            setCursorPointer(false);
                          } else {
                            setSelectedNavIndex(0);
                          }
                        }}
                      >
                        {selectedNavIndex === index && (
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
                            engageItem(item);
                          }}
                        >
                          {getMenuText(item)}
                        </div>
                        {selectedNavIndex === index && (
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
                          if (!engageItem(item)) {
                            setSelectedNavIndex(index);
                            setCursorPointer(false);
                          }
                        }}
                      >
                        {selectedNavIndex === index && (
                          <div
                            className={styles.navItem}
                            style={{ marginRight: 6, marginLeft: -14 }}
                          >
                            {`>`}
                          </div>
                        )}
                        <div className={styles.navItem}>{item}</div>
                        {selectedNavIndex === index && (
                          <div className={styles.navItem}>
                            {activeBlink ? '_' : ''}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          }
        />
      )}
    </>
  );
};

export default Modal;
