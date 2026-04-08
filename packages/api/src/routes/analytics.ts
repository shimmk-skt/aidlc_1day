import { Router } from 'express';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth.js';
import { inventoryService } from '../services/inventory.service.js';
import { jsonApiSuccess } from '../utils/json-api.js';
import db from '../config/database.js';

const router = Router();

router.get('/dashboard', authenticate, requireAdmin, async (_req: AuthRequest, res, next) => {
  try {
    const revenue = await db.query("SELECT COALESCE(SUM(total), 0) as revenue FROM orders WHERE status NOT IN ('cancelled')");
    const totalOrders = await db.query('SELECT COUNT(*) as count FROM orders');
    const totalProducts = await db.query('SELECT COUNT(*) as count FROM products');
    const lowStock = await db.query('SELECT COUNT(*) as count FROM products WHERE stock < 10');
    const recentOrders = await db.query(`SELECT o.id, o.total, o.status, o.created_at, u.name as user_name FROM orders o JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC LIMIT 10`);
    const topProducts = await db.query(`SELECT p.name, SUM(oi.quantity) as total_sold, SUM(oi.quantity * oi.price) as revenue FROM order_items oi JOIN products p ON oi.product_id = p.id GROUP BY p.id, p.name ORDER BY total_sold DESC LIMIT 5`);
    const ordersByStatus = await db.query('SELECT status, COUNT(*) as count FROM orders GROUP BY status');

    res.json(jsonApiSuccess({
      summary: { totalRevenue: parseFloat(revenue.rows[0].revenue), totalOrders: parseInt(totalOrders.rows[0].count), totalProducts: parseInt(totalProducts.rows[0].count), lowStockItems: parseInt(lowStock.rows[0].count) },
      recentOrders: recentOrders.rows,
      topProducts: topProducts.rows,
      ordersByStatus: ordersByStatus.rows,
    }));
  } catch (e) { next(e); }
});

router.get('/inventory', authenticate, requireAdmin, async (_req: AuthRequest, res, next) => {
  try { res.json(jsonApiSuccess(await inventoryService.getInventoryReport())); } catch (e) { next(e); }
});

router.get('/inventory/kpis', authenticate, requireAdmin, async (_req: AuthRequest, res, next) => {
  try { res.json(jsonApiSuccess(await inventoryService.getKPIs())); } catch (e) { next(e); }
});

export default router;
