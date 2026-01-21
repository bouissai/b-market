# syntax=docker.io/docker/dockerfile:1

# ✅ Base commune (Node Alpine léger)
FROM node:18-alpine AS base

# ------------------------------
# ✅ Stage deps: installation des dépendances
# ------------------------------
FROM base AS deps

RUN apk add --no-cache libc6-compat
WORKDIR /app

# Active corepack pour pnpm/yarn (si utilisé)
RUN corepack enable

# Copie des fichiers de lock uniquement
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./

# Installe selon le lockfile présent
RUN \
  if [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then pnpm install --frozen-lockfile; \
  else npm install; \
  fi

# ------------------------------
# ✅ Stage builder: build Next.js + Prisma
# ------------------------------
FROM base AS builder
WORKDIR /app

# IMPORTANT: pnpm n'existe pas ici sinon on réactive corepack
RUN corepack enable

# Copie node_modules depuis deps
COPY --from=deps /app/node_modules ./node_modules

# Copie du code
COPY . .

# Copie prisma (si besoin explicitement)
COPY prisma ./prisma

# Génération Prisma Client
RUN npx prisma generate

# Build Next.js (standalone)
ENV NEXT_TELEMETRY_DISABLED=1

RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# ------------------------------
# ✅ Stage runner: image finale minimaliste
# ------------------------------
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# User non-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copie des assets publics
COPY --from=builder /app/public ./public

# Copie du build Next standalone
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Prisma runtime (client + engines)
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/prisma ./prisma

# Sécurité: exécution en non-root
USER nextjs

# Port Next.js
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
