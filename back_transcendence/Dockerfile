FROM node:18.13.0-alpine

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install

COPY . .

EXPOSE 3001

CMD [ "npm", "start" ]