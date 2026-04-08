import db from '../config/database.js';

export const returnRepository = {
  create: async (orderId: number, reason: string) => {
    const r = await db.query('INSERT INTO returns (order_id, reason, status) VALUES ($1,$2,$3) RETURNING *', [orderId, reason, 'initiated']);
    return r.rows[0];
  },
  findById: async (id: number) => {
    const r = await db.query('SELECT r.*, o.user_id FROM returns r JOIN orders o ON r.order_id = o.id WHERE r.id = $1', [id]);
    return r.rows[0] || null;
  },
  updateStatus: async (id: number, status: string) => {
    const extra = status === 'received' ? ', received_at=NOW()' : status === 'refunded' ? ', refunded_at=NOW()' : '';
    const r = await db.query(`UPDATE returns SET status=$1${extra} WHERE id=$2 RETURNING *`, [status, id]);
    return r.rows[0];
  },
  findByOrderId: async (orderId: number) => {
    const r = await db.query('SELECT * FROM returns WHERE order_id = $1 ORDER BY id DESC', [orderId]);
    return r.rows;
  },
};
