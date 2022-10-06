import Frame from './_core/Frame';
import styles from './index.module.css';
import { SetStateAction, useEffect, useRef, useState } from 'react';
import { MENU, MenuId, MenuOpt } from '@/src/util/menuTraverse';
import { walletLogin } from '@/src/util/walletLogin';
import { useWallet } from '@/src/hooks/useWallets';
import EmailLogin from '../EmailLogin';
import isValidEmail from '@/src/util/isValidEmail';
import { aes_decode, aes_encode } from '@/src/util/auth/aes';
import isValidPassword from '@/src/util/isValidPassword';

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
  triggerLoginReset: number;
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
  triggerLoginReset,
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

  // Below is logic for EmailLogin
  const inputBuffer = useRef<string>('');
  const stateBuffer = useRef<
    | 'not logged in'
    | 'enter email code'
    | 'enter password existing'
    | 'enter password create'
    | 'loading'
  >('not logged in');
  const emailRef = useRef<string>('');

  const [error, setError] = useState<boolean>(false);
  const [code, setCode] = useState<string>('-1');
  // const [email, setEmail] = useState<string>('');


  const [state, setState] = useState<
    | 'not logged in'
    | 'enter email code'
    | 'enter password existing'
    | 'enter password create'
    | 'loading'
  >('not logged in');

  useEffect(() => {
    if (code !== '-1' && !error && state === 'loading') {
      inputBuffer.current = '';
      setState('enter email code');
    }
  }, [code, error, state]);

  useEffect(() => {
    if (state === 'enter email code' && code === inputBuffer.current) {
      inputBuffer.current = '';
      setState('enter password create');
    }
  }, [state, inputBuffer.current]);

  useEffect(() => {
    if (triggerLoginReset > 0) {
      setError(false);
      setCode('-1');
      setState('not logged in');
      inputBuffer.current = '';
    }
  }, [triggerLoginReset]);

  useEffect(() => {
    stateBuffer.current = state;
  }, [state]);

  const createUser = async () => {
    console.log(`createUser pwd:`, inputBuffer.current);
    if (!isValidPassword(inputBuffer.current)) {
      return;
    }
    const fetch_create_user = await fetch(`/api/create-user`, {
      method: 'POST',
      body: JSON.stringify({
        type: 'web2',
        payload: {
          email: emailRef.current,
          password: aes_encode(inputBuffer.current),
        },
      }),
    });

    const create_user_res = await fetch_create_user.json();
  };

  const submitEmail = async () => {
    if (!isValidEmail(inputBuffer.current)) {
      return;
    }

    const fetch_user_exists = await fetch(`/api/get-user`, {
      method: 'POST',
      body: JSON.stringify({
        email: inputBuffer.current,
      }),
    });

    const user_exists = await fetch_user_exists.json();

    if (user_exists.found) {
      setState('enter password existing');
      return;
    }

    setState('loading');

    const fetch_res = await fetch(
      `/api/verify-email?email=${inputBuffer.current}`
    );
    const verification_res = await fetch_res.json();
    if (verification_res.error) {
      setError(true);
      emailRef.current = '';
    } else {
      setCode(aes_decode(verification_res.auth));
      emailRef.current = inputBuffer.current;
    }
  };

  useEffect(() => {
    const update = (e: KeyboardEvent) => {
      if (e.key === 'Delete') {
        inputBuffer.current = '';
        return;
      }
      if (e.key === 'Enter') {
        return;
      }
      const p = inputBuffer.current;
      if (p.length >= 320) {
        return;
      }
      inputBuffer.current = `${p}${e.key}`;
    };

    const listenForDeleteOrEnter = (e: KeyboardEvent) => {
      if (e.key === 'Backspace') {
        const p = inputBuffer.current;

        if (p.length >= 320) {
          return;
        }
        inputBuffer.current = `${p.slice(0, p.length - 1)}`;
        return;
      }
      if (e.key === 'Enter') { 
        if (stateBuffer.current === 'not logged in') {
          submitEmail();
        }
        if (stateBuffer.current === 'enter password create') {
          createUser();
        }
        return;
      }
    };
    window.addEventListener('keypress', e => update(e));
    window.addEventListener('keydown', e => listenForDeleteOrEnter(e));
    return () => {
      window.removeEventListener('keypress', e => update(e));
      window.removeEventListener('keydown', e => listenForDeleteOrEnter(e));
    };
  }, []);

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
          {emailFlow && (
            <EmailLogin
              activeBlink={activeBlink}
              inputBuffer={inputBuffer}
              error={error}
              setError={setError}
              code={code}
              setCode={setCode}
              state={state}
              setState={setState}
              setCursorPointer={setCursorPointer}
            />
          )}
        </Frame>
      )}
    </>
  );
};

export default Modal;
