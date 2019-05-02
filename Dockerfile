FROM node:alpine as builder

WORKDIR /app

COPY tsconfig.json .
COPY package*.json ./
RUN npm ci --no-progress

COPY src/ ./src/

RUN npm run build

FROM node:alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --no-progress --only=production

COPY --from=builder /app/dist/ ./dist/

EXPOSE 3000
CMD [ "npm", "start", "--silent" ]
