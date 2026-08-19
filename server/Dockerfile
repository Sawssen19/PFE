# Stage 1: Builder
FROM node:20-alpine AS builder
WORKDIR /app

# Installation de OpenSSL pour Prisma
RUN apk add --no-cache openssl

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma/
RUN npx prisma generate

COPY . .
RUN npm run build

# Stage 2: Production Runner
FROM node:20-alpine AS runner
WORKDIR /app

# Installation de OpenSSL pour Prisma en prod
RUN apk add --no-cache openssl

COPY package*.json ./
RUN npm ci --only=production

COPY prisma ./prisma/
RUN npx prisma generate

COPY --from=builder /app/dist ./dist

EXPOSE 5000
CMD ["npm", "start"]