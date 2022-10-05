import { aes_decode } from '@/src/util/auth/aes';
import isValidEmail from '@/src/util/isValidEmail';
import { useEffect, useRef, useState } from 'react';
import styles from './index.module.css';

interface Props {
  activeBlink: boolean;
  inputBuffer: React.MutableRefObject<string>;
  error: boolean;
  setError: React.Dispatch<React.SetStateAction<boolean>>;
  code: string;
  setCode: React.Dispatch<React.SetStateAction<string>>;
  state: '0' | '1' | '2' | '3';
  setState: React.Dispatch<React.SetStateAction<'0' | '1' | '2' | '3'>>;
}

const EmailLogin: React.FC<Props> = ({ activeBlink, inputBuffer, error, setError, code, setCode, state, setState }) => { 
  
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
    case '2': {
      return (
        <div className={styles.container}>
          <div style={{ display: 'flex' }}>
            <div
              className={styles.text}
              style={{ paddingRight: 4 }}
            >{`enter password:`}</div>
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
