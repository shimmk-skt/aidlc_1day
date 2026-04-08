import db from '../config/database.js';

export const addressRepository = {
  findByUser: async (userId: number) => {
    const r = await db.query('SELECT * FROM addresses WHERE user_id = $1 ORDER BY is_default DESC, id DESC', [userId]);
    return r.rows;
  },
  create: async (userId: number, data: { label?: string; recipient_name: string; phone?: string; address_line1: string; address_line2?: string; city: string; postal_code: string; is_default?: boolean }) => {
    if (data.is_default) await db.query('UPDATE addresses SET is_default = false WHERE user_id = $1', [userId]);
    const r = await db.query('INSERT INTO addresses (user_id, label, recipient_name, phone, address_line1, address_line2, city, postal_code, is_default) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *', [userId, data.label, data.recipient_name, data.phone, data.address_line1, data.address_line2, data.city, data.postal_code, data.is_default || false]);
    return r.rows[0];
  },
  delete: async (id: number, userId: number) => {
    await db.query('DELETE FROM addresses WHERE id = $1 AND user_id = $2', [id, userId]);
  },
};
