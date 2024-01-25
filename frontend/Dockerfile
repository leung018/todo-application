FROM node:20

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./
COPY .yarnrc.yml ./
COPY .yarn/releases ./.yarn/releases

RUN yarn install --immutable

COPY src ./src
COPY public ./public
COPY tsconfig.json ./

ARG REACT_APP_API_ENDPOINT
ENV REACT_APP_API_ENDPOINT=$REACT_APP_API_ENDPOINT

RUN yarn build
CMD ["yarn", "start"]