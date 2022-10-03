import crypto from 'crypto';

const init_hex = process.env.INIT_HEX;
const encryption_hex = process.env.ENCRYPTION_HEX;
const encryption_algo = 'aes-256-cbc';

export const aes_decode = (input: string) => {
  if (!init_hex) {
    throw Error('process.env.INIT_HEX not found');
  }
  if (!encryption_hex) {
    throw Error('process.env.ENCRYPTION_HEX not found');
  }
  const data = input.split('0x')[1];
  const decipher = crypto.createDecipheriv(
    encryption_algo,
    Buffer.from(encryption_hex, 'hex'),
    Buffer.from(init_hex, 'hex')
  );
  let decoded_data = decipher.update(data, 'hex', 'utf-8');
  decoded_data += decipher.final('utf-8');
  return decoded_data;
};

export const aes_encode = (input: string) => {
  if (!init_hex) {
    throw Error('process.env.INIT_HEX not found');
  }
  if (!encryption_hex) {
    throw Error('process.env.ENCRYPTION_HEX not found');
  }
  const cipher = crypto.createCipheriv(
    encryption_algo,
    Buffer.from(encryption_hex, 'hex'),
    Buffer.from(init_hex, 'hex')
  );

  let encoded_data = cipher.update(input, 'utf-8', 'hex');
  encoded_data += cipher.final('hex');
  return `0x${encoded_data}`;
};
