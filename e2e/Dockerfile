FROM cypress/base:latest

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./
COPY .yarnrc.yml ./
COPY .yarn/releases ./.yarn/releases

RUN yarn install

CMD ["yarn", "cypress", "run", "--e2e"]
