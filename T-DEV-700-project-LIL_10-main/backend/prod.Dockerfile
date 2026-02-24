# Creation of the builder image
FROM node:slim AS builder

WORKDIR /app

# Install app dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

# Final image
FROM gcr.io/distroless/nodejs:18

WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app /app

EXPOSE 5000

# Run the application
CMD [ "server.js" ]
