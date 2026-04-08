import db from '../config/database.js';

export const paymentRepository = {
  create: async (orderId: number, paymentKey: string, method: string, amount: number, status: string) => {
    const r = await db.query('INSERT INTO payments (order_id, payment_key, method, amount, status, paid_at) VALUES ($1,$2,$3,$4,$5,NOW()) RETURNING *', [orderId, paymentKey, method, amount, status]);
    return r.rows[0];
  },
  updateStatus: async (paymentKey: string, status: string) => {
    const r = await db.query(`UPDATE payments SET status=$1, cancelled_at = CASE WHEN $1 IN ('cancelled','refunded') THEN NOW() ELSE cancelled_at END WHERE payment_key=$2 RETURNING *`, [status, paymentKey]);
    return r.rows[0];
  },
  findByOrderId: async (orderId: number) => {
    const r = await db.query('SELECT * FROM payments WHERE order_id = $1 ORDER BY id DESC LIMIT 1', [orderId]);
    return r.rows[0] || null;
  },
};
