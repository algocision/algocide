import { RefreshRes } from 'pages/api/refresh-auth';

export const refreshToken = async (
  token: string
): Promise<{ token: string; valid: boolean }> => {
  const verified_fetch_res = await fetch(`/api/refresh-auth`, {
    method: 'POST',
    body: JSON.stringify({ token: token }),
  });

  const verified_res: RefreshRes = await verified_fetch_res.json();

  if (verified_res.valid) {
    return { token: verified_res.updated_token, valid: true };
  }
  return { token: '', valid: false };
};

export default refreshToken;
