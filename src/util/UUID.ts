export const compress = (uuid: string) => {
  const b16 = uuid.replaceAll('-', '');
  return Buffer.from(b16, 'hex').toString('base64url');
};

export const expand = (b64: string) => {
  const b16 = Buffer.from(b64, 'base64url').toString('hex');

  let uuid = '';
  for (let i = 0; i < b16.length; i++) {
    if (i === 8 || i === 12 || i === 16 || i === 20) {
      uuid += `-${b16[i]}`;
    } else {
      uuid += b16[i];
    }
  }

  return uuid;
};
