FROM node:16
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /opt/app/
COPY ./package.json ./
RUN npm install

COPY ./ .
RUN npm run build
EXPOSE 1337

CMD ["npm", "start"]
