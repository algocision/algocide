import { useConnectWallet } from '@/src/components/ConnectWallet/useConnectWallet';
import { useWallet } from '@/src/hooks/useWallets';
import getToken from '@/src/util/auth/getToken';
import { verify } from '@/src/util/auth/verify';
import { providers } from 'ethers';
import { NextPage } from 'next';
import { AppProps } from 'next/app';
import Script from 'next/script';
import React, { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../src/styles/globals.css';

export interface IPageProps {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  connectedAddress?: string;
  connectWallet: () => Promise<void>;
  disconnect: () => Promise<void>;
}

interface IRootProps extends AppProps {
  Component: NextPage<any, IPageProps>;
}

export default function App(props: IRootProps) {
  const { Component } = props;

  const [darkMode, setDarkMode] = useState<boolean>();

  const { connectedAddress } = useWallet();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    if (darkMode !== undefined) {
      if (darkMode) {
        // Set value of  darkmode to dark
        document.documentElement.setAttribute('data-theme', 'dark');
        window.localStorage.setItem('theme', 'dark');
      } else {
        // Set value of  darkmode to light
        document.documentElement.setAttribute('data-theme', 'light');
        window.localStorage.setItem('theme', 'light');
      }
    }
  }, [darkMode]);

  useEffect(() => {
    const root = window.document.documentElement;
    const initialColorValue = root.style.getPropertyValue(
      '--initial-color-mode'
    );
    // Set initial darkmode to light
    setDarkMode(initialColorValue === 'dark');
  }, []);

  // useEffect(() => {
  //   const ethersProvider = new providers.InfuraProvider(
  //     'homestead',
  //     '9925264eeb594f05a06fc1367d936d6e'
  //   );
  //   const signer = ethersProvider.getSigner();

  //   let accounts: string[] = [''];
  //   if (accounts0 || accounts1 || accounts2) {
  //     if (accounts0) {
  //       accounts = accounts0;
  //     } else if (accounts1) {
  //       accounts = accounts1;
  //     } else if (accounts2) {
  //       accounts = accounts2;
  //     } else {
  //       return;
  //     }
  //   }
  //   if (signer && accounts[0] !== '') {
  //     const verified = verify(signer, accounts[0]);
  //     Promise.resolve(verified).then(is_verified => {
  //       setIsAuthenticated(is_verified);
  //     });
  //   }
  // }, [accounts0, accounts1, accounts2]);

  // useEffect(() => {
  //   const getUserData = async (connectedAddress: string) => {
  //     const user_res = await fetch(
  //       `/api/db/get-user?token=${getToken(connectedAddress)}`,
  //       {
  //         method: 'GET',
  //         mode: 'cors',
  //       }
  //     );
  //     const user_data = await user_res.json();

  //     // console.log(`user_json`, user_json);
  //     setUserData(user_data);
  //   };
  //   if (isAuthenticated && connectedAddress) {
  //     getUserData(connectedAddress);
  //   }
  // }, [isAuthenticated, connectedAddress]);

  return (
    <>
      <ToastContainer toastClassName="custom-notify" position="top-center" />
      <Script
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GA_TAG}`}
      />
      <Script
        strategy="lazyOnload"
        id="gtag"
      >{`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments)} gtag('js', new Date()); gtag('config', '${process.env.GA_TAG}');`}</Script>

      <Component darkMode={darkMode} setDarkMode={setDarkMode} />
    </>
  );
}
