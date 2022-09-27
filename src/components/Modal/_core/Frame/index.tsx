import React, { useEffect, useState } from 'react';
import styles from './index.module.css';

interface Props {
  content?: React.ReactNode;
  width?: string;
  height?: string;
  header?: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setCursorPointer: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
}

const Frame: React.FC<Props> = ({
  content,
  width,
  height,
  header,
  loading,
  setIsOpen,
  setCursorPointer,
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
    if (content && (content as any).type && (content as any).type.displayName) {
      setTitle((content as any).type.displayName);
    }
  }, [content]);
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
            console.log(`close`);
            setIsOpen(false);
            setCursorPointer(false);
          }}
        />
        {/* <div className={styles.minimizeButton} />
        <div
          className={styles.fullScreenButton}
          // onClick={() => {
          //   setExpanded(prevState => !prevState);
          // }}
        /> */}
        <div className={styles.title}>{title}</div>
      </div>
      <div className={styles.contentContainer}>{content}</div>
    </div>
  );
};

export default Frame;
