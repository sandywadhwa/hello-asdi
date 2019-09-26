FROM node:8.16.1-alpine

RUN mkdir /beingzero-src
WORKDIR /beingzero-src

COPY . ./

RUN npm install
CMD node server.js

