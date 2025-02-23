# Use a lightweight Node.js image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and yarn.lock first (to optimize caching)
COPY package.json yarn.lock /app/

# Install dependencies
RUN yarn install --production

# Copy the WebSocket server code
COPY . /app/

# Expose port 3000 for WebSocket
EXPOSE 3000

# Start the WebSocket server
CMD ["node", "server.js"]
