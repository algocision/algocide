import { aes_decode } from '@/src/util/auth/aes';
import { useEffect, useRef, useState } from 'react';
import styles from './index.module.css';
interface Props {
  activeBlink: boolean;
}
const EmailLogin: React.FC<Props> = ({ activeBlink }) => {
  const inputBuffer = useRef<string>('');

  const [error, setError] = useState<boolean>(false);
  const [code, setCode] = useState<string>('-1');

  const [state, setState] = useState<'0' | '1' | '2' | '3'>('0');

  useEffect(() => {
    if (code !== '-1' && !error) {
      if (state === '0') {
        inputBuffer.current = '';
        setState('1');
      }
    }
  }, [code, error]);

  useEffect(() => {}, []);

  const submit = async () => {
    const fetch_res = await fetch(
      `/api/verify-email?email=${inputBuffer.current}`
    );
    const verification_res = await fetch_res.json();
    if (verification_res.error) {
      setError(true);
    } else {
      setCode(aes_decode(verification_res.auth));
    }
  };

  useEffect(() => {
    console.log(inputBuffer);
  }, [inputBuffer]);

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
      inputBuffer.current = `${p}${e.key}`;
      //   setInputBuffer(p => `${p}${e.key}`);
    };

    const listenForDeleteOrEnter = (e: KeyboardEvent) => {
      if (e.key === 'Backspace') {
        const p = inputBuffer.current;
        inputBuffer.current = `${p.slice(0, p.length - 1)}`;
        return;
      }
      if (e.key === 'Enter') {
        submit();
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

  switch (state) {
    case '0': {
      return (
        <div className={styles.container}>
          <div style={{ display: 'flex' }}>
            <div
              className={styles.text}
              style={{ paddingRight: 4 }}
            >{`enter email:`}</div>
            <div className={styles.text}>{inputBuffer.current}</div>
            <div className={styles.text}>{activeBlink ? '_' : ''}</div>
          </div>
        </div>
      );
    }
    case '1': {
      return (
        <div className={styles.container}>
          <div style={{ display: 'flex' }}>
            <div
              className={styles.text}
              style={{ paddingRight: 4 }}
            >{`enter code:`}</div>
            <div className={styles.text}>{inputBuffer.current}</div>
            <div className={styles.text}>{activeBlink ? '_' : ''}</div>
          </div>
        </div>
      );
    }
    default: {
      return <></>;
    }
  }
};

export default EmailLogin;
