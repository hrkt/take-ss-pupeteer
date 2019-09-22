FROM hrkt/command-as-a-service:latest

# from https://raw.githubusercontent.com/nodejs/docker-node/master/Dockerfile-alpine.template
ENV NODE_VERSION 10.16.3

RUN apk add --update nodejs nodejs-npm chromium

WORKDIR /opt/take-ss
COPY package.json /opt/take-ss
COPY package-lock.json /opt/take-ss
RUN npm install
RUN mkdir /api
COPY for-container/takess /api
RUN chmod +x /api/takess
COPY for-container/app-settings.json /
COPY src/take-ss.js /opt/take-ss/take-ss
COPY log4js.json /opt/take-ss
ENV CHROME_BIN=/usr/bin/chromium-browser
WORKDIR /
