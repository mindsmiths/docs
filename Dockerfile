FROM node:latest as base

ENV NPM_CONFIG_LOGLEVEL=warn
ENV NPM_CONFIG_COLOR=false

WORKDIR /home/node/app
COPY . /home/node/app/

FROM base as development
WORKDIR /home/node/app
RUN npm install
EXPOSE 3000
CMD ["npm", "start"]
