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
import { SignInRes } from 'pages/api/sign-in';
import verifyToken from '@/src/util/auth/verifyToken';
import IAppContext from '@/src/types/IAppContext';

export type SignInStates =
  | 'not logged in'
  | 'enter email code'
  | 'enter password existing'
  | 'enter password create'
  | 'logged in'
  | 'loading';

interface Props {
  ctx: IAppContext;
  setCtx: React.Dispatch<React.SetStateAction<IAppContext>>;
  engageItem: (el: MenuOpt) => boolean;
}

export const Modal: React.FC<Props> = ({ ctx, setCtx, engageItem }) => {
  // Reset indices on close
  useEffect(() => {
    if (!ctx.modalActive) {
      setCtx(p => ({ ...p, menuId: '-1', menuIndex: 0 }));
    }
  }, [ctx.modalActive]);

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
  const stateBuffer = useRef<SignInStates>('not logged in');
  const emailRef = useRef<string>('');

  const [error, setError] = useState<boolean>(false);
  const [code, setCode] = useState<string>('-1'); 

  const [state, setState] = useState<SignInStates>('not logged in');

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
    if (state === 'logged in') {
      setCtx(p => ({
        ...p,
        emailFlowActive: false,
        menuId: '-1',
        modalActive: false,
        menuIndex: 0,
      }));
      setError(false);
      setCode('-1');
      inputBuffer.current = '';
    }
  }, [state, inputBuffer.current]);

  useEffect(() => {
    if (ctx.triggerLoginReset > 0) {
      setError(false);
      setCode('-1');
      setState('not logged in');
      inputBuffer.current = '';
    }
  }, [ctx.triggerLoginReset]);

  useEffect(() => {
    stateBuffer.current = state;
  }, [state]);

  const createUser = async () => {
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
          token: aes_encode(Date.now().toString()),
        },
      }),
    });

    const create_user_res = await fetch_create_user.json();
    if (create_user_res.error) {
      return;
    }
    if (create_user_res.token) {
      localStorage.setItem('token', create_user_res.token);
      setState('logged in');
    }
  };

  const signIn = async () => {
    const fetch_sign_in = await fetch(`/api/sign-in`, {
      method: 'POST',
      body: JSON.stringify({
        type: 'web2',
        payload: {
          email: emailRef.current,
          password: aes_encode(inputBuffer.current),
          token: aes_encode(Date.now().toString()),
        },
      }),
    });

    const sign_in_res: SignInRes = await fetch_sign_in.json();
    if (sign_in_res.error) {
      return;
    }
    if (sign_in_res.token) {
      localStorage.setItem('token', sign_in_res.token);
      setState('logged in');
    }
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
      emailRef.current = inputBuffer.current;
      inputBuffer.current = '';
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
          return;
        }
        if (stateBuffer.current === 'enter password create') {
          createUser();
          return;
        }
        if (stateBuffer.current === 'enter password existing') {
          signIn();
          return;
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
      {ctx.modalActive && (
        <Frame
          loading={false}
          header={ctx.menuId[0] === '0' ? 'connect' : 'explore'}
          open={ctx.modalActive}
          setIsOpen={val => setCtx(p => ({ ...p, modalActive: val }))}
          setCursorPointer={val => setCtx(p => ({ ...p, cursorPointer: val }))}
        >
          <>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {ctx.modalActive &&
                MENU[ctx.menuId].map((item: MenuOpt, index: number) => {
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
                          setCtx(p => ({ ...p, cursorPointer: true }));
                        }}
                        onMouseLeave={() => {
                          setCtx(p => ({ ...p, cursorPointer: false }));
                        }}
                        onClick={() => {
                          if (!engageItem(item)) {
                            setCtx(p => ({
                              ...p,
                              cursorPointer: false,
                              menuIndex: index,
                            }));
                          } else {
                            setCtx(p => ({ ...p, menuIndex: 0 }));
                          }
                        }}
                      >
                        {ctx.menuIndex === index && (
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
                        {ctx.menuIndex === index && (
                          <div className={styles.navItem}>
                            {ctx.activeBlink ? '_' : ''}
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
                          setCtx(p => ({ ...p, cursorPointer: true }));
                        }}
                        onMouseLeave={() => {
                          setCtx(p => ({ ...p, cursorPointer: false }));
                        }}
                        onClick={() => {
                          if (!engageItem(item)) {
                            setCtx(p => ({
                              ...p,
                              cursorPointer: false,
                              menuIndex: index,
                            }));
                          }
                        }}
                      >
                        {ctx.menuIndex === index && (
                          <div
                            className={styles.navItem}
                            style={{ marginRight: 6, marginLeft: -14 }}
                          >
                            {`>`}
                          </div>
                        )}
                        <div className={styles.navItem}>{item}</div>
                        {ctx.menuIndex === index && (
                          <div className={styles.navItem}>
                            {ctx.activeBlink ? '_' : ''}
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
      {ctx.emailFlowActive && (
        <Frame
          loading={false}
          header={'login w/ email'}
          setIsOpen={val => setCtx(p => ({ ...p, emailFlowActive: val }))}
          open={ctx.emailFlowActive}
          setCursorPointer={val => setCtx(p => ({ ...p, cursorPointer: val }))}
        >
          {ctx.emailFlowActive && (
            <EmailLogin
              activeBlink={ctx.activeBlink}
              inputBuffer={inputBuffer}
              error={error}
              setError={setError}
              code={code}
              setCode={setCode}
              state={state}
              setState={setState}
              setCursorPointer={val =>
                setCtx(p => ({ ...p, cursorPointer: val }))
              }
            />
          )}
        </Frame>
      )}
    </>
  );
};

export default Modal;
