import db from '../config/database.js';

export const productRepository = {
  findAll: async () => {
    const r = await db.query('SELECT * FROM products ORDER BY created_at DESC');
    return r.rows;
  },
  findById: async (id: number) => {
    const r = await db.query('SELECT * FROM products WHERE id = $1', [id]);
    return r.rows[0] || null;
  },
  create: async (data: { name: string; description: string; price: number; stock: number; image_url: string; category?: string }) => {
    const r = await db.query('INSERT INTO products (name, description, price, stock, image_url, category) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *', [data.name, data.description, data.price, data.stock, data.image_url, data.category || null]);
    return r.rows[0];
  },
  update: async (id: number, data: { name: string; description: string; price: number; stock: number; image_url: string; category?: string }) => {
    const r = await db.query('UPDATE products SET name=$1, description=$2, price=$3, stock=$4, image_url=$5, category=$6 WHERE id=$7 RETURNING *', [data.name, data.description, data.price, data.stock, data.image_url, data.category || null, id]);
    return r.rows[0];
  },
  delete: async (id: number) => {
    await db.query('DELETE FROM products WHERE id = $1', [id]);
  },
  reserve: async (id: number, qty: number) => {
    const r = await db.query('UPDATE products SET reserved_qty = reserved_qty + $1 WHERE id = $2 AND (stock - reserved_qty) >= $1 RETURNING *', [qty, id]);
    return r.rows[0] || null;
  },
  release: async (id: number, qty: number) => {
    await db.query('UPDATE products SET reserved_qty = GREATEST(reserved_qty - $1, 0) WHERE id = $2', [qty, id]);
  },
  confirmReservation: async (id: number, qty: number) => {
    await db.query('UPDATE products SET stock = stock - $1, reserved_qty = GREATEST(reserved_qty - $1, 0) WHERE id = $2', [qty, id]);
  },
};
