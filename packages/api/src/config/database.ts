import pg from 'pg';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

const pool = new pg.Pool({
  connectionString: env.databaseUrl,
  max: env.dbMaxConnections,
  idleTimeoutMillis: 30000,
});

pool.on('error', (err) => {
  logger.error({ err }, 'Unexpected database pool error');
});

export const db = {
  query: (text: string, params?: unknown[]) => pool.query(text, params),
  getClient: () => pool.connect(),
  pool,
};

export default db;
