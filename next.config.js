/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

const isDev = false;

const env = {
  IS_DEV: isDev ? 'true' : 'false',
  GA_TAG: '',
  DATABASE_URL: process.env.DATABASE_URL,
  INFURA_ID: process.env.INFURA_ID,
  ENCRYPTION_HEX: process.env.ENCRYPTION_HEX,
  INIT_HEX: process.env.INIT_HEX,
  GMAIL_REFRESH_TOKEN: process.env.GMAIL_REFRESH_TOKEN,
  GMAIL_CLIENT_ID: process.env.GMAIL_CLIENT_ID,
  GMAIL_CLIENT_SECRET: process.env.GMAIL_CLIENT_SECRET,
  GMAIL_REDIRECT_URI: process.env.GMAIL_REDIRECT_URI,
  EXPIRATION_TIME: process.env.EXPIRATION_TIME,
};

module.exports = {
  nextConfig,
  env,
};
