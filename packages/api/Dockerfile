FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY dist/ ./dist/
COPY public/ ./public/
EXPOSE 3001
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:3001/api/health || exit 1
CMD ["node", "dist/index.js"]
