FROM node:16-slim

RUN npm install pm2 -g
WORKDIR /opt/app/
COPY ./package.json ./
COPY ./patches ./patches
RUN npm install

COPY ./config ./config
COPY ./src ./src
COPY ./public ./public
COPY ./ecosystem.config.js ./
COPY ./favicon.ico ./
RUN NODE_ENV=production npm run build

EXPOSE 80
EXPOSE 443
CMD ["pm2-runtime", "ecosystem.config.js"]
