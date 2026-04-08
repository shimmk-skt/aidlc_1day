import db from '../config/database.js';
import crypto from 'crypto';

export const refreshTokenRepository = {
  create: async (userId: number, token: string, expiresAt: Date) => {
    const hash = crypto.createHash('sha256').update(token).digest('hex');
    await db.query('INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1,$2,$3)', [userId, hash, expiresAt]);
  },
  findValid: async (token: string) => {
    const hash = crypto.createHash('sha256').update(token).digest('hex');
    const r = await db.query('SELECT * FROM refresh_tokens WHERE token_hash = $1 AND revoked = false AND expires_at > NOW()', [hash]);
    return r.rows[0] || null;
  },
  revoke: async (token: string) => {
    const hash = crypto.createHash('sha256').update(token).digest('hex');
    await db.query('UPDATE refresh_tokens SET revoked = true WHERE token_hash = $1', [hash]);
  },
  revokeAllForUser: async (userId: number) => {
    await db.query('UPDATE refresh_tokens SET revoked = true WHERE user_id = $1', [userId]);
  },
};
