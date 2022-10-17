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
import IAppContext, { IAppContextInit } from '@/src/types/IAppContext';
import verifyToken from '@/src/util/auth/verifyToken';

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

const Home: NextPage<IPageProps> = ({ ctx, setCtx }) => {
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

  const canvasRef = useRef<any>();
  const textRef1 = useRef<any>();

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
        setCtx(p => ({ ...p, activeBlink: !p.activeBlink }));
      }
    };
    if (ctx.stateInc === 0) {
      blinkInit();
    }
  }, [ctx.stateInc]);

  useEffect(() => {
    if (textRef1 && textRef1.current && windowWidth) {
      const width = textRef1.current.getComputedTextLength();
      const x = windowWidth / 2 - width / 2;
      setCtx(p => ({ ...p, text1: { x, width } }));
    }
  }, [textRef1, windowWidth]);

  useEffect(() => {
    setCtx(p => ({ ...p, stateInc: p.stateInc + 1 }));
  }, []);

  useEffect(() => {
    if (keys.up === 1) {
      setCtx(p => ({
        ...p,
        menuIndex:
          p.menuIndex === 0 ? MENU[ctx.menuId].length - 1 : p.menuIndex - 1,
      }));
      return;
    }
    if (keys.down === 1) {
      setCtx(p => ({
        ...p,
        menuIndex:
          p.menuIndex === MENU[ctx.menuId].length - 1 ? 0 : p.menuIndex + 1,
      }));
      return;
    }

    if (keys.enter === 1) {
      if (ctx.emailFlowActive) {
        // Block enter key from interfering with key listener in
        // @/src/components/EmailLogin/index.tsx
        return;
      }
      if (ctx.menuId === '-1') {
        setCtx(p => ({
          ...p,
          modalActive: true,
          menuId: `${ctx.menuIndex}` as MenuId,
          menuIndex: 0,
        }));
        return;
      }
      engageItem(get_opt_from_index(ctx.menuIndex, ctx.menuId));
      return;
    }
    if (keys.escape === 1) {
      if (ctx.modalActive && back(ctx.menuId) !== '-1') {
        setCtx(p => ({ ...p, menuId: back(p.menuId) }));
        return;
      }
      if (ctx.emailFlowActive && !ctx.modalActive) {
        setCtx(p => ({
          ...p,
          triggerLoginReset: p.triggerLoginReset + 1,
          emailFlowActive: false,
          modalActive: true,
          menuId: '0',
        }));
        return;
      }

      setCtx(p => ({ ...p, modalActive: false }));
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
        setCtx(p => ({
          ...p,
          menuId: '0-0',
          menuIndex: 0,
        }));
        return true;
      }
      case 'pcparttracker': {
        if (process.env.REDIRECTS) {
          window.open(
            JSON.parse(process.env.REDIRECTS).pcparttracker,
            '_blank'
          );
        }
        return true;
      }
      case 'themeit': {
        if (process.env.REDIRECTS) {
          window.open(JSON.parse(process.env.REDIRECTS).themeit, '_blank');
        }
        return true;
      }
      case 'ytdata': {
        if (process.env.REDIRECTS) {
          window.open(
            `${JSON.parse(process.env.REDIRECTS).ytdata}/?token=${ctx.token}`,
            '_blank'
          );
        }
      }
      case 'login w/ email': {
        if (ctx.token && ctx.token !== '') {
          verifyToken(ctx.token);
          return true;
        }
        setCtx(p => ({
          ...p,
          emailFlowActive: true,
          modalActive: false,
          cursorPointer: false,
        }));
        return true;
      }
      default: {
        return false;
      }
    }
  };

  // useEffect(() => {
  //   console.log(`ctx`, ctx);
  // }, [ctx]);

  return (
    <>
      <Head>
        <title>Home</title>
        <meta name="description" content="Home Page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.container}>
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
            x={ctx.text1.x}
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
                ctx.cursorPointer
                  ? styles.cursorFollowHover
                  : styles.cursorFollow
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
                  ctx.cursorPointer
                    ? styles.cursorFollowHover
                    : styles.cursorFollow
                }
                cx={cursorX}
                cy={cursorY}
                r="15px"
              />
            )}
            <text
              y="200"
              x={ctx.text1.x}
              fontSize={`${windowWidth / 10}px`}
              letterSpacing={`${windowWidth / 125}px`}
              fontFamily="Skygraze"
            >
              {`ALGOCIDE`}
            </text>
          </clipPath>
        </svg>
        <div className={styles.navContainer}>
          <Modal ctx={ctx} setCtx={setCtx} engageItem={engageItem} />
          {!ctx.modalActive &&
            !ctx.emailFlowActive &&
            MENU['-1'].map((item: string, index: number) => {
              return (
                <div
                  key={item}
                  style={{ display: 'flex', width: `100px`, padding: 10 }}
                  onMouseEnter={() => {
                    setCtx(p => ({ ...p, cursorPointer: true }));
                  }}
                  onMouseLeave={() => {
                    setCtx(p => ({ ...p, cursorPointer: false }));
                  }}
                  onClick={() => {
                    setCtx(p => ({
                      ...p,
                      menuId: `${index}` as MenuId,
                      modalActive: true,
                      cursorPointer: false,
                    }));
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
