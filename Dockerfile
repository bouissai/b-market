# Utilise la dernière syntaxe Docker pour plus de fonctionnalités
# Voir : https://docs.docker.com/build/building/multi-platform/
# syntax=docker.io/docker/dockerfile:1

# ✅ Étape de base commune avec Node.js Alpine (léger)
FROM node:18-alpine AS base

# ✅ Étape pour installer les dépendances (sans copier tout le code)
FROM base AS deps

# ➕ Ajout de bibliothèques système nécessaires (pour certaines dépendances comme Prisma)
RUN apk add --no-cache libc6-compat

# Définit le dossier de travail dans le conteneur
WORKDIR /app

# ✅ Copie uniquement les fichiers nécessaires pour l'installation des dépendances
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./

# 📦 Installe les dépendances selon le gestionnaire utilisé
RUN npm install



# ✅ Étape de build du projet Next.js
FROM base AS builder
WORKDIR /app

# Copie les `node_modules` depuis l’étape précédente
COPY --from=deps /app/node_modules ./node_modules

# Copie tout le reste du code source dans l’image
COPY . .
COPY prisma ./prisma

# 🧬 Génère le client Prisma (obligatoire pour que le build fonctionne avec `standalone`)
RUN npx prisma generate

# ⚙️ Lance le build Next.js (standalone)
RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi


# ✅ Étape finale – image de production minimale
FROM base AS runner
WORKDIR /app

# 🛡️ Mode production
ENV NODE_ENV=production

# 👤 Crée un utilisateur non-root pour plus de sécurité
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# ✅ Copie les assets publics (images, favicon, etc.)
COPY --from=builder /app/public ./public

# ✅ Copie le build standalone optimisé
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# ✅ Copie les fichiers nécessaires pour Prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# 🔒 Utilise l'utilisateur non-root pour exécuter l'app
USER nextjs

# 📡 Expose le port utilisé par Next.js
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# 🚀 Lancement de l'application Next.js standalone
CMD ["node", "server.js"]
