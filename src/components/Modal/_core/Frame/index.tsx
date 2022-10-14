import React, { useEffect, useState } from 'react';
import styles from './index.module.css';

interface Props {
  children?: React.ReactNode;
  width?: string;
  height?: string;
  header?: string;
  open: boolean;
  setIsOpen: (val: boolean) => void;
  setCursorPointer: (val: boolean) => void;
  loading: boolean;
}

const Frame: React.FC<Props> = ({
  children,
  width,
  height,
  header,
  loading,
  setIsOpen,
  setCursorPointer,
  open,
}) => {
  const [title, setTitle] = useState<string>(header ? header : '');

  const [expanded, setExpanded] = useState<boolean>(false);

  const [widthNum, setWidthNum] = useState<string>('400px');
  const [heightNum, setHeightNum] = useState<string>('300px');

  useEffect(() => {
    let w_num = width ? width : '400px';
    let h_num = height ? height : '300px';

    const w_number = parseInt(w_num.split('px')[0]) * (expanded ? 2 : 1);
    const h_number = parseInt(h_num.split('px')[0]) * (expanded ? 2 : 1);

    setWidthNum(`${w_number}px`);
    setHeightNum(`${h_number}px`);
  }, [expanded, width, height]);

  useEffect(() => {
    if (
      children &&
      (children as any).type &&
      (children as any).type.displayName
    ) {
      setTitle((children as any).type.displayName);
    }
  }, [children]);
  return (
    <div
      className={styles.container}
      style={{
        width: widthNum,
        height: heightNum,
      }}
    >
      <div className={styles.header}>
        <div
          className={styles.closeButton}
          onMouseEnter={() => setCursorPointer(true)}
          onMouseLeave={() => setCursorPointer(false)}
          onClick={() => {
            setIsOpen(false);
            setCursorPointer(false);
          }}
        /> 
        <div className={styles.title}>{title}</div>
      </div>
      <div className={styles.contentContainer}>{children}</div>
    </div>
  );
};

export default Frame;
