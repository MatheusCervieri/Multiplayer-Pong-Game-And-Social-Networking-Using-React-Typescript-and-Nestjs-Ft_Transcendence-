FROM node:18.13.0-alpine

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install

COPY . .

RUN npm install -g nodemon

# Set environment variables
ENV NODE_ENV=development
ENV PORT=3001

EXPOSE 3001

EXPOSE 8001

CMD ["npm", "run", "start:dev"]