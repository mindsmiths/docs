FROM node:latest as base

ENV NPM_CONFIG_LOGLEVEL=warn
ENV NPM_CONFIG_COLOR=false

WORKDIR /home/node/app
COPY package.json .
RUN npm install

COPY . .

FROM base as development
WORKDIR /home/node/app
EXPOSE 3000
CMD ["npm", "start"]
