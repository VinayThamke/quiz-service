# 1. Use an official Node.js runtime as a parent image (LTS version)
FROM node:20-alpine

# 2. Set the working directory inside the container
WORKDIR /usr/src/app

# 3. Copy package.json and package-lock.json first
# This allows Docker to cache your dependencies if they haven't changed
COPY package*.json ./

# 4. Install dependencies (Clean install for production)
RUN npm ci

# 5. Copy the rest of your app's source code
COPY . .

# 6. Build the TypeScript code to the /dist folder
RUN npm run build

# 7. Inform Docker that the container listens on the specified port at runtime
EXPOSE 4000

# 8. Define the command to run your app
CMD [ "npm", "start" ]
