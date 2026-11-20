# Multi-stage Dockerfile for Backend Application
# Base image
FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies based on package-lock.json
COPY package*.json ./
RUN npm ci --only=production

# Bundle app source
COPY . .

# Environment variable for port with default fallback
ENV PORT=5000
ENV NODE_ENV=production

# Expose port (Google Cloud Run also dynamically sets PORT)
EXPOSE 5000

# Run backend server
CMD ["node", "src/server.js"]
