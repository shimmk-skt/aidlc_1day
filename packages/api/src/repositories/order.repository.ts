import db from '../config/database.js';

export const orderRepository = {
  create: async (userId: number, subtotal: number, gst: number, total: number, addressId?: number) => {
    const r = await db.query('INSERT INTO orders (user_id, shipping_address_id, subtotal, gst, total, status) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *', [userId, addressId || null, subtotal, gst, total, 'pending']);
    return r.rows[0];
  },
  addItem: async (orderId: number, productId: number, quantity: number, price: number) => {
    await db.query('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1,$2,$3,$4)', [orderId, productId, quantity, price]);
  },
  findByUser: async (userId: number) => {
    const r = await db.query('SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    return r.rows;
  },
  findAll: async () => {
    const r = await db.query('SELECT o.*, u.name as user_name, u.email as user_email FROM orders o JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC');
    return r.rows;
  },
  findById: async (id: number) => {
    const r = await db.query('SELECT o.*, u.name as user_name, u.email as user_email FROM orders o JOIN users u ON o.user_id = u.id WHERE o.id = $1', [id]);
    return r.rows[0] || null;
  },
  findItemsByOrderId: async (orderId: number) => {
    const r = await db.query('SELECT oi.*, p.name as product_name FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = $1', [orderId]);
    return r.rows;
  },
  updateStatus: async (id: number, status: string) => {
    const r = await db.query('UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *', [status, id]);
    return r.rows[0];
  },
};
