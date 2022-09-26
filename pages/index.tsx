import useCursor from '@/src/hooks/useCursor';
import useWindow from '@/src/hooks/useWindow';
import useArrowKeys from '@/src/hooks/useArrowKeys';
import { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import styles from '../src/styles/pages/index.module.css';
import { IPageProps } from './_app';
import useClick from '@/src/hooks/useClick';
import { isMobile } from 'react-device-detect';

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
  const [cursorPointer, setCursorPointer] = useState<boolean>(false);
  const [stateInc, setStateInc] = useState<number>(0);
  const [activeBlink, setActiveBlink] = useState<boolean>(false);
  const [selectedNavItem, setSelectedNavItem] = useState<0 | 1>(0);

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
  const { keys } = useArrowKeys();
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
    if (keys.up === 1 && selectedNavItem > 0) {
      setSelectedNavItem(0);
      return;
    }
    if (keys.down === 1 && selectedNavItem < 1) {
      setSelectedNavItem(1);
      return;
    }
  }, [keys]);

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
              style={{ transition: ' 0.02s linear' }}
              // points={`${cursorX - 30},${cursorY - 30}, ${cursorX + 30},${
              //   cursorY - 30
              // }, ${cursorX + 30},${cursorY + 30}, ${cursorX - 30},${
              //   cursorY + 30
              // }`}
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
                style={{ transition: ' 0.02s linear' }}
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
        <canvas
          width={windowWidth}
          height={windowHeight}
          ref={canvasRef}
          className={styles.matrix}
        />

        <div className={styles.navContainer}>
          <div
            style={{ display: 'flex', width: `100px`, padding: 10 }}
            onMouseEnter={() => {
              setCursorPointer(true);
            }}
            onMouseLeave={() => {
              setCursorPointer(false);
            }}
            onClick={() => {
              setSelectedNavItem(0);
            }}
          >
            {selectedNavItem === 0 && (
              <div
                className={styles.navItem}
                style={{ marginRight: 6, marginLeft: -14 }}
              >
                {`>`}
              </div>
            )}
            <div className={styles.navItem}>{`connect`}</div>
            {selectedNavItem === 0 && (
              <div className={styles.navItem}>{activeBlink ? '_' : ''}</div>
            )}
          </div>
          <div
            style={{ display: 'flex', width: `100px`, padding: 10 }}
            onMouseEnter={() => {
              setCursorPointer(true);
            }}
            onMouseLeave={() => {
              setCursorPointer(false);
            }}
            onClick={() => {
              setSelectedNavItem(1);
            }}
          >
            {selectedNavItem === 1 && (
              <div
                className={styles.navItem}
                style={{ marginRight: 6, marginLeft: -14 }}
              >{`>`}</div>
            )}
            <div className={styles.navItem}>{`explore`}</div>
            {selectedNavItem === 1 && (
              <div className={styles.navItem}>{activeBlink ? '_' : ''}</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
