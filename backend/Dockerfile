# Build stage
FROM node:14-slim AS build

WORKDIR /app

# Install dependencies
COPY ../package*.json ./
RUN npm ci --only=production

# Copy source files
COPY . .

# -----

# Production stage
FROM node:14-alpine

WORKDIR /app

# Create a non-root user
USER node

# Copy node modules and built files from the build image
COPY --from=build /app .

EXPOSE 5000
CMD ["node", "index.js"]
