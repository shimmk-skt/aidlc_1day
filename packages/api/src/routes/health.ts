import { Router } from 'express';
import db from '../config/database.js';
import { redis } from '../config/redis.js';

const router = Router();

router.get('/', async (_req, res) => {
  const checks: Record<string, string> = {};
  try { await db.query('SELECT 1'); checks.database = 'ok'; } catch { checks.database = 'error'; }
  try { if (redis) { await redis.ping(); checks.redis = 'ok'; } else { checks.redis = 'unavailable'; } } catch { checks.redis = 'error'; }

  const healthy = checks.database === 'ok';
  res.status(healthy ? 200 : 503).json({ status: healthy ? 'healthy' : 'unhealthy', checks });
});

export default router;
