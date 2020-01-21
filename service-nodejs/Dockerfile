FROM arf95/npm-alpine:latest as build
WORKDIR /usr/src/app
RUN apk update && apk upgrade && \
    apk add --update --no-cache \
    gcc g++ make autoconf python2

COPY package*.json ./
COPY package-lock*.json ./
COPY lerna*.json ./
COPY . ./

RUN npm ci --production && \
    npm i lerna && npm run-script build

FROM arf95/npm-alpine:latest
WORKDIR /usr/src/app

COPY .babelrc .
COPY --from=build /usr/src/app .
