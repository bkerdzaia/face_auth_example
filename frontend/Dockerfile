FROM node:alpine

WORKDIR /frontapp/

COPY package.json /frontapp/

RUN npm install

COPY ./public /frontapp/public
COPY ./src /frontapp/src

CMD ["npm", "run", "start"]
