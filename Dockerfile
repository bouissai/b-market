# syntax=docker.io/docker/dockerfile:1

# ✅ Étape de base commune avec Node.js Alpine (léger)
FROM node:18-alpine AS base

# ✅ Étape pour installer les dépendances (sans copier tout le code)
FROM base AS deps

RUN apk add --no-cache libc6-compat

WORKDIR /app

# 🔧 AJOUT : activer corepack (pnpm/yarn)
RUN corepack enable

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./

# 🔧 MODIF MINIMALE : installer selon le lockfile
RUN \
  if [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then pnpm install --frozen-lockfile; \
  else npm install; \
  fi

# ✅ Étape de build du projet Next.js
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .
COPY prisma ./prisma

# Prisma client
RUN npx prisma generate

# Build Next.js (standalone)
RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# ✅ Étape finale – image de production minimale
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy static assets
COPY --from=builder /app/public ./public

# Copy build
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy prisma client & schema
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/prisma ./prisma

# Sécurité
USER nextjs

# Port Next.js
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
