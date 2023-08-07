# Build stage
FROM node:14-slim AS build

WORKDIR /app

# Install dependencies
COPY ../package*.json ./
RUN npm ci

# Copy source files and build the frontend
COPY . .
RUN npm run build

# -----

# Production stage
FROM node:14-slim

WORKDIR /app

# Copy the built files from the build image
COPY --from=build /app/build /app/build

# Expose port 3000
EXPOSE 3000

# Start the Node.js server
CMD ["npm", "start"]
