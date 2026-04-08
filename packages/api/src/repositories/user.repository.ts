import db from '../config/database.js';

export const userRepository = {
  findByEmail: async (email: string) => {
    const r = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    return r.rows[0] || null;
  },
  findById: async (id: number) => {
    const r = await db.query('SELECT id, email, name, role, created_at FROM users WHERE id = $1', [id]);
    return r.rows[0] || null;
  },
  create: async (email: string, hashedPassword: string, name: string, role = 'customer') => {
    const r = await db.query('INSERT INTO users (email, password, name, role) VALUES ($1,$2,$3,$4) RETURNING id, email, name, role', [email, hashedPassword, name, role]);
    return r.rows[0];
  },
};
