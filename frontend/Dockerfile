FROM ruby:3.3.5-alpine3.20

ENV NODE_ENV=production

RUN apk add --no-cache nodejs npm bash

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm run build
RUN npm install -g serve

COPY . .

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]