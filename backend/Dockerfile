FROM node:20

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./
COPY .yarnrc.yml ./
COPY .yarn/releases ./.yarn/releases

RUN yarn install --immutable

COPY tsconfig.json ./
COPY src ./src
COPY openapi.yaml ./

RUN yarn build
CMD ["yarn", "start"]