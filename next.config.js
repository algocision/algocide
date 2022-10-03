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
};

module.exports = {
  nextConfig,
  env,
};
