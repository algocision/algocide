// TODO: Sign a message and pass as a parameter for secured login

import { Web3UserCreate } from 'pages/api/create-user';

export const walletLogin = async (address: string) => {
  const get_user_fetch = await fetch('/api/get-user', {
    method: 'POST',
    body: JSON.stringify({
      walletAddress: address,
    }),
  });
  const user_res = await get_user_fetch.json();

  if (user_res.data) {
    return;
  }

  const create_user_payload: Web3UserCreate = {
    walletAddress: address,
  };

  const create_user_fetch = await fetch('/api/create-user', {
    method: 'POST',
    body: JSON.stringify({
      type: 'web3',
      payload: create_user_payload,
    }),
  });
  const create_user_res = await create_user_fetch.json();
};
