FROM hrkt/command-as-a-service:latest

# from https://raw.githubusercontent.com/nodejs/docker-node/master/Dockerfile-alpine.template
ENV NODE_VERSION 10.16.3

#RUN apk add --update nodejs nodejs-npm chromium
RUN apk add --no-cache \
      udev \
      chromium \
      nss \
      freetype \
      freetype-dev \
      harfbuzz \
      ca-certificates \
      ttf-freefont \
      nodejs \
      yarn \
      nodejs-npm

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

RUN mkdir /noto
ADD https://noto-website.storage.googleapis.com/pkgs/NotoSansCJKjp-hinted.zip /noto

WORKDIR /noto

RUN unzip NotoSansCJKjp-hinted.zip && \
    mkdir -p /usr/share/fonts/noto && \
    cp *.otf /usr/share/fonts/noto && \
    chmod 644 -R /usr/share/fonts/noto/ && \
    fc-cache -fv

RUN rm -rf /noto

WORKDIR /opt/take-ss
COPY package.json /opt/take-ss
COPY package-lock.json /opt/take-ss
RUN npm install
RUN mkdir /api
COPY for-container/takess /api
RUN chmod +x /api/takess
COPY for-container/app-settings.json /
COPY src/take-ss.js /opt/take-ss/
COPY log4js.json /opt/take-ss
ENV CHROME_BIN /usr/bin/chromium-browser
ENV TAKE_SS_SERVERSIDE_MODE true
WORKDIR /
