FROM node:latest

WORKDIR /app

COPY ./package*.json ./

RUN npm install && apt-get install -y openssl

COPY . .

EXPOSE 5000

CMD [ "npm", "run", "dev" ]
