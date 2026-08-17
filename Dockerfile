# ---- 1) deps: só instala as dependências (cacheável) ----
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---- 2) builder: gera o Prisma Client e compila o Next ----
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate && npm run build

# ---- 3) runtime: imagem final enxuta o bastante p/ rodar ----
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
EXPOSE 3000

# migrate + seed são idempotentes (seed re-executável) -> seguros a cada boot
CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma db seed && npm start"]