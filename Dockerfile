FROM node:18-alpine

WORKDIR /app

# Install OpenSSL 1.1 compatibility library for Prisma on Alpine
# Prisma requires libssl.so.1.1 but Alpine uses OpenSSL 3.x
RUN apk add --no-cache openssl1.1-compat

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

# Start the application
CMD ["node", "dist/src/main.js"]
