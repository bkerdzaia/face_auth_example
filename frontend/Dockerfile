FROM node:alpine

WORKDIR /frontapp/

COPY package.json /frontapp/

RUN npm install

COPY . /frontapp/

RUN yarn global add serve-handler http http-proxy

RUN npm run build

COPY ./serve.js /frontapp/build

ENV PORT=${PORT:-3000}

CMD node ./build/serve.js
