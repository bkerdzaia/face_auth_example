FROM node:alpine

WORKDIR /frontapp/

COPY package.json /frontapp/

RUN npm install

COPY . /frontapp/

CMD ["npm", "run", "start"]
