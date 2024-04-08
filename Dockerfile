FROM node:20.11.1-alpine

WORKDIR /src

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install

COPY . .

CMD ["node", "src/index.js"]