import Redis from 'ioredis';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

let redis: Redis | null = null;

export const initRedis = async () => {
  try {
    redis = new Redis(env.redisUrl, { maxRetriesPerRequest: 3, lazyConnect: true });
    redis.on('error', (err) => logger.warn({ err }, 'Redis connection error — falling back to DB'));
    redis.on('connect', () => logger.info('Redis connected'));
    await redis.connect();
  } catch {
    logger.warn('Redis unavailable — running without cache');
    redis = null;
  }
};

export { redis };
