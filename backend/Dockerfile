# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy dependencies from builder
COPY --from=builder /app/node_modules ./node_modules

# Copy application code
COPY . .

# Fix line endings and make entrypoint script executable
RUN sed -i 's/\r//' docker-entrypoint.sh && chmod +x docker-entrypoint.sh

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=15s --retries=3 \
  CMD node -e "require('http').get('http://localhost:' + (process.env.PORT || 5001) + '/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application with entrypoint
CMD ["./docker-entrypoint.sh"]
