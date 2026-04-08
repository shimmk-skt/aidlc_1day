import { redis } from '../config/redis.js';
import { productRepository } from '../repositories/product.repository.js';
import { InsufficientStockError } from '../utils/errors.js';
import db from '../config/database.js';

const CACHE_TTL = 30;

export const inventoryService = {
  getStock: async (productId: number) => {
    if (redis) {
      const cached = await redis.get(`inv:${productId}`);
      if (cached) return JSON.parse(cached);
    }
    const p = await productRepository.findById(productId);
    if (p && redis) await redis.setex(`inv:${productId}`, CACHE_TTL, JSON.stringify({ stock: p.stock, reserved_qty: p.reserved_qty }));
    return p ? { stock: p.stock, reserved_qty: p.reserved_qty } : null;
  },

  reserve: async (productId: number, qty: number) => {
    const result = await productRepository.reserve(productId, qty);
    if (!result) throw new InsufficientStockError(productId);
    if (redis) await redis.del(`inv:${productId}`);
    return true;
  },

  release: async (productId: number, qty: number) => {
    await productRepository.release(productId, qty);
    if (redis) await redis.del(`inv:${productId}`);
  },

  confirmReservation: async (productId: number, qty: number) => {
    await productRepository.confirmReservation(productId, qty);
    if (redis) await redis.del(`inv:${productId}`);
  },

  getInventoryReport: async () => {
    const r = await db.query(`SELECT id, name, stock, reserved_qty, price, category,
      CASE WHEN stock = 0 THEN 'out_of_stock' WHEN stock < 10 THEN 'low_stock' ELSE 'in_stock' END as status
      FROM products ORDER BY stock ASC`);
    return r.rows;
  },

  getKPIs: async () => {
    const totalProducts = await db.query('SELECT COUNT(*) as count FROM products');
    const lowStock = await db.query('SELECT COUNT(*) as count FROM products WHERE stock < 10');
    const outOfStock = await db.query('SELECT COUNT(*) as count FROM products WHERE stock = 0');
    const totalValue = await db.query('SELECT COALESCE(SUM(stock * price), 0) as value FROM products');
    return {
      totalProducts: parseInt(totalProducts.rows[0].count),
      lowStockItems: parseInt(lowStock.rows[0].count),
      outOfStockItems: parseInt(outOfStock.rows[0].count),
      totalInventoryValue: parseFloat(totalValue.rows[0].value),
    };
  },
};
