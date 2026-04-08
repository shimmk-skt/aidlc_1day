FROM node:20-alpine AS build
RUN corepack enable
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/frontend/package.json ./packages/frontend/
RUN pnpm install --frozen-lockfile --filter frontend
COPY packages/frontend/ ./packages/frontend/
RUN pnpm --filter frontend run build

FROM nginx:alpine
COPY --from=build /app/packages/frontend/dist /usr/share/nginx/html
COPY packages/frontend/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD curl -f http://localhost/ || exit 1
CMD ["nginx", "-g", "daemon off;"]
