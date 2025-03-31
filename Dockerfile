FROM node:22.9.0-slim

RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

RUN corepack enable

# Create app directory
WORKDIR /usr/src/app

# Copy all files at once
COPY . .

# Install dependencies with all workspace files present
RUN yarn install

# Build the TypeScript files
RUN yarn build

# Expose port 8080
EXPOSE 8080

# Start the app
CMD [ "yarn", "start" ]
