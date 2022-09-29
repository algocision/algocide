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
};

module.exports = {
  nextConfig,
  env,
};
