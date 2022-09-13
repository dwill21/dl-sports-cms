FROM node:16-slim
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /opt/app/
COPY ./package.json ./
RUN npm install
RUN npm install pm2 -g

COPY ./config ./config
COPY ./src ./src
COPY ./ecosystem.config.js ./
COPY ./favicon.ico ./
RUN npm run build

EXPOSE 1337
CMD ["pm2-runtime", "ecosystem.config.js"]
