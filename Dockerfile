FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install ALL dependencies (including devDependencies for build)
RUN npm install

# Copy source code
COPY . .

# Generate Prisma client
RUN npm run prisma:generate

# Build the application
RUN npm run build

# Expose port
EXPOSE 3001

# Start the application (Node.js will resolve dist/main to dist/main.js)
CMD ["node", "dist/main"]
