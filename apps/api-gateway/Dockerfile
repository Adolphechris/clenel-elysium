# Dockerfile Cloud Run - ELLYSIUM PGI API Gateway
FROM node:22-alpine AS builder

WORKDIR /app
COPY package*.json ./
COPY packages ./packages
COPY apps/api-gateway ./apps/api-gateway

RUN npm ci && npm run build --workspace=@elysium/api-gateway

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080

RUN addgroup -S elysium && adduser -S elysium -G elysium

COPY --from=builder /app /app
USER elysium

EXPOSE 8080
CMD ["node", "apps/api-gateway/dist/server.js"]
