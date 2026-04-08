import db from '../config/database.js';

export const shipmentRepository = {
  create: async (orderId: number, carrier: string, trackingNumber: string) => {
    const r = await db.query('INSERT INTO shipments (order_id, carrier, tracking_number, status, shipped_at) VALUES ($1,$2,$3,$4,NOW()) RETURNING *', [orderId, carrier, trackingNumber, 'in_transit']);
    return r.rows[0];
  },
  updateStatus: async (id: number, status: string) => {
    const r = await db.query(`UPDATE shipments SET status=$1, delivered_at = CASE WHEN $1='delivered' THEN NOW() ELSE delivered_at END WHERE id=$2 RETURNING *`, [status, id]);
    return r.rows[0];
  },
  findByOrderId: async (orderId: number) => {
    const r = await db.query('SELECT * FROM shipments WHERE order_id = $1 ORDER BY id DESC LIMIT 1', [orderId]);
    return r.rows[0] || null;
  },
};
