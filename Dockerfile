# syntax=docker.io/docker/dockerfile:1

FROM node:20-alpine AS base
WORKDIR /app

# ------------------------------
# deps: install dependencies
# ------------------------------
FROM base AS deps

RUN apk add --no-cache libc6-compat
RUN corepack enable

COPY package.json pnpm-lock.yaml* package-lock.json* yarn.lock* .npmrc* ./

RUN \
  if [ -f pnpm-lock.yaml ]; then pnpm install --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
  else npm install; \
  fi

# ------------------------------
# builder: build next + prisma
# ------------------------------
FROM base AS builder

RUN corepack enable

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

# Prisma client generation
RUN npx prisma generate

# Build
RUN \
  if [ -f pnpm-lock.yaml ]; then pnpm run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f yarn.lock ]; then yarn run build; \
  else npm run build; \
  fi

# ------------------------------
# runner: production image
# ------------------------------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# user non-root
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# ✅ Copier le standalone Next
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# ✅ IMPORTANT: copier node_modules en entier (Prisma + engines inclus, compatible pnpm)
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]
