import useCursor from '@/src/hooks/useCursor';
import useWindow from '@/src/hooks/useWindow';
import useKeys from '@/src/hooks/useKeys';
import { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import styles from '../src/styles/pages/index.module.css';
import { IPageProps } from './_app';
import useClick from '@/src/hooks/useClick';
import { isMobile } from 'react-device-detect';
import Frame from '@/src/components/Modal/_core/Frame';
import {
  back,
  get_opt_from_index,
  MENU,
  MenuId,
  MenuOpt,
  next,
} from '@/src/util/menuTraverse';
import { Modal } from '@/src/components/Modal';
import { useConnectWallet } from '@/src/components/ConnectWallet/useConnectWallet';
import useActiveState from '@/src/hooks/useActiveState';

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

const animate = (ref: React.MutableRefObject<any>) => {
  const ctx = ref.current.getContext('2d');
  const height = ref.current.height;
  const width = ref.current.width;

  // abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|\`]}
  const characters = `01`.split('');

  const font_size = 10;
  const columns = Math.floor(width / font_size);

  const drops: any[] = [];

  for (let x = 0; x < columns; x++) {
    drops[x] = 1;
  }

  const draw = () => {
    //Black BG for the canvas
    //translucent BG to show trail
    ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#64d86b';
    ctx.font = font_size + 'px arial';
    //looping over drops
    for (let i = 0; i < drops.length; i++) {
      //a random chinese character to print
      let text = characters[Math.floor(Math.random() * characters.length)];
      //x = i*font_size, y = value of drops[i]*font_size
      ctx.fillText(text, i * font_size, drops[i] * font_size);

      //sending the drop back to the top randomly after it has crossed the screen
      //adding a randomness to the reset to make the drops scattered on the Y axis
      if (drops[i] * font_size > height && Math.random() > 0.975) drops[i] = 0;

      //incrementing Y coordinate
      drops[i]++;
    }
  };
  setInterval(draw, 35);
};

const Home: NextPage<IPageProps> = ({}) => {
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

  const [cursorPointer, setCursorPointer] = useState<boolean>(false);
  const [modalActive, setModalActive] = useState<boolean>(false);
  const [stateInc, setStateInc] = useState<number>(0);
  const [activeBlink, setActiveBlink] = useState<boolean>(false);
  const [menuId, setMenuId] = useState<MenuId>('-1');
  const [triggerLoginReset, setTriggerLoginReset] = useState<number>(0);
  const { emailFlowActive, setEmailFlowActive } = useActiveState();

  const [menuIndex, setMenuIndex] = useState<number>(0);

  const canvasRef = useRef<any>();
  const textRef1 = useRef<any>();

  const [text1, setText1] = useState<{
    x?: number;
    y?: number;
    width?: number;
    height?: number;
  }>({});

  const { windowWidth, windowHeight } = useWindow();
  const { cursorX, cursorY } = useCursor();
  const { keys } = useKeys();
  const { clickActive } = useClick();

  useEffect(() => {
    if (canvasRef) {
      animate(canvasRef);
    }
  }, [canvasRef, windowWidth, windowHeight]);

  useEffect(() => {
    const blinkInit = async () => {
      while (true) {
        await sleep(500);
        setActiveBlink(p => !p);
      }
    };
    if (stateInc === 0) {
      blinkInit();
    }
  }, [stateInc]);

  useEffect(() => {
    if (textRef1 && textRef1.current && windowWidth) {
      const width = textRef1.current.getComputedTextLength();
      const x = windowWidth / 2 - width / 2;
      setText1({ x, width });
    }
  }, [textRef1, windowWidth]);

  useEffect(() => {
    setStateInc(p => p + 1);
  }, [stateInc]);

  useEffect(() => {
    if (keys.up === 1) {
      setMenuIndex(p => (p === 0 ? MENU[menuId].length - 1 : p - 1));
      return;
    }
    if (keys.down === 1) {
      setMenuIndex(p => (p === MENU[menuId].length - 1 ? 0 : p + 1));
      return;
    }

    if (keys.enter === 1) {
      if (emailFlowActive) {
        // Block enter key from interfering with key listener in
        // @/src/components/EmailLogin/index.tsx
        return;
      }
      if (menuId === '-1') {
        setMenuIndex(0);
        setModalActive(true);
        setMenuId(`${menuIndex}` as MenuId);
        return;
      }
      engageItem(get_opt_from_index(menuIndex, menuId));
      return;
    }
    if (keys.escape === 1) {
      if (modalActive && back(menuId) !== '-1') {
        setMenuId(back(menuId));
        return;
      }
      if (emailFlowActive && !modalActive) {
        setTriggerLoginReset(p => p + 1);
        setEmailFlowActive(false);
        setModalActive(true);
        setMenuIndex(0);
        setMenuId('0');
        return;
      }

      setModalActive(false);
    }
  }, [keys]);

  const engageItem = (el: MenuOpt): boolean => {
    switch (el) {
      case 'metamask': {
        disconnect1();
        disconnect2();
        isActive0 ? disconnect0() : connect0();
        return true;
      }
      case 'coinbase wallet': {
        disconnect0();
        disconnect2();
        isActive1 ? disconnect1() : connect1();
        return true;
      }
      case 'walletconnect': {
        disconnect0();
        disconnect1();
        isActive2 ? disconnect2() : connect2();
        return true;
      }
      case 'connect wallet': {
        setMenuId('0-0');
        setMenuIndex(0);
        return true;
      }
      case 'pcparttracker': {
        window.open('https://pcparttracker.com/', '_blank');
        return true;
      }
      case 'themeit': {
        window.open('https://theme-it-yeqggr54rq-uk.a.run.app', '_blank');
        return true;
      }
      case 'login w/ email': {
        const token = localStorage.getItem('token');
        if (token) {
          return true;
        }
        setEmailFlowActive(true);
        setModalActive(false);
        setCursorPointer(false);
        return true;
      }
      default: {
        return false;
      }
    }
  };

  return (
    <>
      <Head>
        <title>Home</title>
        <meta name="description" content="Home Page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        className={styles.container}
        // style={{
        //   background: `radial-gradient(circle at ${cursorX}px ${cursorY}px, rgba(255,255,255,1) 20px, rgba(0,0,0,1) 150px)`,
        // }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={windowWidth}
          height={windowHeight}
          viewBox={`0 0 ${windowWidth} ${windowHeight}`}
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <text
            id="algocide"
            ref={textRef1}
            x={text1.x}
            y="200"
            fontSize={`${windowWidth / 10}px`}
            letterSpacing={`${windowWidth / 125}px`}
            fontFamily="Skygraze"
            paintOrder="stroke"
            stroke="#64d86b"
            strokeWidth="3px"
            strokeLinecap="butt"
            strokeLinejoin="miter"
          >
            {`ALGOCIDE`}
          </text>
          {!isMobile && (
            <circle
              className={
                cursorPointer ? styles.cursorFollowHover : styles.cursorFollow
              }
              cx={cursorX}
              cy={cursorY}
              r="15px"
              stroke={clickActive ? '#ff0000' : '#64d86b'}
              strokeWidth="2px"
              strokeLinecap="butt"
              strokeLinejoin="miter"
            />
          )}
          <clipPath id="clip-path">
            {!isMobile && (
              <circle
                className={
                  cursorPointer ? styles.cursorFollowHover : styles.cursorFollow
                }
                cx={cursorX}
                cy={cursorY}
                // r={clickActive ? '1px' : '15px'}
                r="15px"
                // style={{ transition: ' 0.02s linear' }}
                // points={`${cursorX - 30},${cursorY - 30}, ${cursorX + 30},${
                //   cursorY - 30
                // }, ${cursorX + 30},${cursorY + 30}, ${cursorX - 30},${
                //   cursorY + 30
                // }`}
              />
            )}
            <text
              y="200"
              x={text1.x}
              fontSize={`${windowWidth / 10}px`}
              letterSpacing={`${windowWidth / 125}px`}
              fontFamily="Skygraze"
            >
              {`ALGOCIDE`}
            </text>
          </clipPath>
        </svg>
        <div className={styles.navContainer}>
          <Modal
            modalActive={modalActive}
            setModalActive={setModalActive}
            activeBlink={activeBlink}
            setCursorPointer={setCursorPointer}
            menuId={menuId}
            setMenuId={setMenuId}
            setSelectedNavIndex={setMenuIndex}
            selectedNavIndex={menuIndex}
            engageItem={engageItem}
            emailFlow={emailFlowActive}
            setEmailFlow={setEmailFlowActive}
            triggerLoginReset={triggerLoginReset}
          />
          {!modalActive &&
            !emailFlowActive &&
            MENU['-1'].map((item: string, index: number) => {
              return (
                <div
                  key={item}
                  style={{ display: 'flex', width: `100px`, padding: 10 }}
                  onMouseEnter={() => {
                    setCursorPointer(true);
                  }}
                  onMouseLeave={() => {
                    setCursorPointer(false);
                  }}
                  onClick={() => {
                    setMenuId(`${index}` as MenuId);
                    setModalActive(true);
                    setCursorPointer(false);
                  }}
                >
                  {menuIndex === index && (
                    <div
                      className={styles.navItem}
                      style={{ marginRight: 6, marginLeft: -14 }}
                    >
                      {`>`}
                    </div>
                  )}
                  <div className={styles.navItem}>{item}</div>
                  {menuIndex === index && (
                    <div className={styles.navItem}>
                      {activeBlink ? '_' : ''}
                    </div>
                  )}
                </div>
              );
            })}
        </div>

        {!isMobile && (
          <div
            className={styles.cursorDot}
            style={{
              left: cursorX - 1.5,
              top: cursorY - 1.5,
              backgroundColor: clickActive ? '#ff0000' : '#64d86b',
            }}
          />
        )}
      </div>

      <canvas
        width={windowWidth}
        height={windowHeight}
        ref={canvasRef}
        className={styles.matrix}
      />
    </>
  );
};

export default Home;
