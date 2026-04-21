FROM node:20-alpine

WORKDIR /app

COPY code/Backend/package*.json ./

RUN npm install

COPY code/Backend/ ./

EXPOSE 5000

CMD ["node", "src/server.js"]