FROM node:14-alpine as react-builder

ENV NODE_ENV production

WORKDIR /app

COPY package.json package.json

RUN apk add --no-cache git

RUN yarn install --frozen-lockfile

RUN yarn add --dev @types/node @types/react@18.0.0

COPY . .

RUN yarn build

CMD ["yarn", "start"]
