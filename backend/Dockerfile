FROM node:18-alpine

WORKDIR /app

# Install Docker CLI
RUN apk add --no-cache docker-cli

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "run", "dev"]
