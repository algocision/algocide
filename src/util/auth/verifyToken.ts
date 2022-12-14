import { RefreshRes } from 'pages/api/refresh-auth';

export const verifyToken = async (token: string) => {
  const verified_fetch_res = await fetch(`/api/refresh-auth`, {
    method: 'POST',
    body: JSON.stringify({ token: token }),
  });

  const verified_res: RefreshRes = await verified_fetch_res.json();

  if (verified_res.valid) {
    return true;
  }
  return false;
};

export default verifyToken;
