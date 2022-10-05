import Frame from './_core/Frame';
import styles from './index.module.css';
import { useEffect } from 'react';
import { MENU, MenuId, MenuOpt } from '@/src/util/menuTraverse';
import { walletLogin } from '@/src/util/walletLogin';
import { useWallet } from '@/src/hooks/useWallets';
import EmailLogin from '../EmailLogin';

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
  emailFlow: boolean;
  setEmailFlow: React.Dispatch<React.SetStateAction<boolean>>;
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
  emailFlow,
  setEmailFlow,
}) => {
  // Reset indices on close
  useEffect(() => {
    if (!modalActive) {
      setMenuId('-1');
      setSelectedNavIndex(0);
    }
  }, [modalActive]);

  const { connectedAddress, activeWallet } = useWallet();

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
      if (activeWallet === 'metamask') {
        return connectedAddress && shortenAddress(connectedAddress);
      }
      return 'metamask';
    }
    if (item === 'coinbase wallet') {
      if (activeWallet === 'coinbase wallet') {
        return connectedAddress && shortenAddress(connectedAddress);
      }
      return 'coinbase wallet';
    }
    if (item === 'walletconnect') {
      if (activeWallet === 'walletconnect') {
        return connectedAddress && shortenAddress(connectedAddress);
      }
      return 'walletconnect';
    }
  };

  useEffect(() => {
    if (connectedAddress) {
      walletLogin(connectedAddress);
    }
  }, [connectedAddress]);

  return (
    <>
      {modalActive && (
        <Frame
          loading={false}
          header={menuId[0] === '0' ? 'connect' : 'explore'}
          open={modalActive}
          setIsOpen={setModalActive}
          setCursorPointer={setCursorPointer}
        >
          <>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {modalActive &&
                MENU[menuId].map((item: MenuOpt, index: number) => {
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
        </Frame>
      )}
      {emailFlow && (
        <Frame
          loading={false}
          header={'login w/ email'}
          setIsOpen={setEmailFlow}
          open={emailFlow}
          setCursorPointer={setCursorPointer}
        >
          <EmailLogin activeBlink={activeBlink} active={emailFlow} />
        </Frame>
      )}
    </>
  );
};

export default Modal;
