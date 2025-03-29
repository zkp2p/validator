FROM node:22.9.0-slim

RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

RUN corepack enable

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN yarn install

# Bundle app source
COPY . .

# Build the TypeScript files
RUN yarn build

# Expose port 8080
EXPOSE 8080

# Start the app
CMD [ "yarn", "start" ]
