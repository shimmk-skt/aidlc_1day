FROM node:20-alpine AS deps
RUN apk add --no-cache python3 make g++ && corepack enable
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/api/package.json ./packages/api/
RUN pnpm install --frozen-lockfile --filter api --prod \
    && cd /app/node_modules/.pnpm/bcrypt@5.1.1/node_modules/bcrypt \
    && npx node-pre-gyp install --fallback-to-build

FROM node:20-alpine
RUN corepack enable
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/api/node_modules ./packages/api/node_modules
COPY packages/api/dist/ ./packages/api/dist/
COPY packages/api/public/ ./packages/api/public/
COPY packages/api/src/config/schema.sql ./packages/api/dist/config/
COPY packages/api/entrypoint.sh ./packages/api/
WORKDIR /app/packages/api
EXPOSE 3001
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1
ENTRYPOINT ["sh", "entrypoint.sh"]
