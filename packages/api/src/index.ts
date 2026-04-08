import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';
import { requestId } from './middleware/request-id.js';
import { apiLimiter } from './middleware/rate-limit.js';
import { errorHandler } from './middleware/error-handler.js';
import { initSocketIO } from './config/socket.js';
import { initRedis } from './config/redis.js';
import authRoutes from './routes/auth.js';
import productsRoutes from './routes/products.js';
import ordersRoutes from './routes/orders.js';
import analyticsRoutes from './routes/analytics.js';
import healthRoutes from './routes/health.js';
import paymentsRoutes from './routes/payments.js';
import shippingRoutes from './routes/shipping.js';
import returnsRoutes from './routes/returns.js';
import addressesRoutes from './routes/addresses.js';
import aiRoutes from './routes/ai.js';
import forecastRoutes from './routes/forecast.js';
import recommendationsRoutes from './routes/recommendations.js';
import marketplaceRoutes from './routes/marketplace.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);

// Initialize Redis
await initRedis();

// Socket.IO
initSocketIO(httpServer);

// Security & middleware
app.use(helmet({ contentSecurityPolicy: env.nodeEnv === 'production' ? undefined : false }));
app.use(cors({ origin: env.corsOrigin, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(requestId);
app.use(apiLimiter);
app.use('/images', express.static(path.join(__dirname, '../public/images')));

// Routes
app.use('/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/shipping', shippingRoutes);
app.use('/api/returns', returnsRoutes);
app.use('/api/addresses', addressesRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/forecast', forecastRoutes);
app.use('/api/recommendations', recommendationsRoutes);
app.use('/api/marketplace', marketplaceRoutes);

// Error handler
app.use(errorHandler);

process.on('unhandledRejection', (reason) => {
  logger.error({ reason }, 'Unhandled rejection');
});

httpServer.listen(env.port, () => {
  logger.info({ port: env.port, env: env.nodeEnv }, 'Inventrix API server started');
});

export default app;
