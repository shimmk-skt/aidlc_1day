import { orderRepository } from '../repositories/order.repository.js';
import { productRepository } from '../repositories/product.repository.js';
import { inventoryService } from './inventory.service.js';
import { NotFoundError, ForbiddenError, InvalidStateTransitionError } from '../utils/errors.js';
import { ORDER_TRANSITIONS } from '../types/index.js';
import { broadcast } from '../config/socket.js';
import db from '../config/database.js';

const ADMIN_ROLES = ['admin', 'operations_manager', 'inventory_manager', 'finance_manager'];

export const orderService = {
  create: async (userId: number, items: { product_id: number; quantity: number }[]) => {
    const client = await db.getClient();
    try {
      await client.query('BEGIN');

      let subtotal = 0;
      const priceMap: { id: number; price: number; qty: number }[] = [];

      for (const item of items) {
        const reserved = await client.query(
          'UPDATE products SET reserved_qty = reserved_qty + $1 WHERE id = $2 AND (stock - reserved_qty) >= $1 RETURNING price',
          [item.quantity, item.product_id]
        );
        if (reserved.rowCount === 0) {
          await client.query('ROLLBACK');
          throw new (await import('../utils/errors.js')).InsufficientStockError(item.product_id);
        }
        subtotal += parseFloat(reserved.rows[0].price) * item.quantity;
        priceMap.push({ id: item.product_id, price: parseFloat(reserved.rows[0].price), qty: item.quantity });
      }

      const gst = Math.round(subtotal * 0.10 * 100) / 100;
      const total = Math.round((subtotal + gst) * 100) / 100;

      const order = await client.query(
        'INSERT INTO orders (user_id, subtotal, gst, total, status) VALUES ($1,$2,$3,$4,$5) RETURNING *',
        [userId, subtotal, gst, total, 'pending']
      );
      const orderId = order.rows[0].id;

      for (const p of priceMap) {
        await client.query('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1,$2,$3,$4)', [orderId, p.id, p.qty, p.price]);
      }

      await client.query('COMMIT');

      broadcast.newOrder(orderId, total, '');
      for (const p of priceMap) broadcast.inventoryUpdate(p.id, 0, 0);

      return { id: orderId, subtotal, gst, total, status: 'pending' };
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },

  findByUser: (userId: number) => orderRepository.findByUser(userId),
  findAll: () => orderRepository.findAll(),

  findById: async (id: number, userId?: number, role?: string) => {
    const order = await orderRepository.findById(id);
    if (!order) throw new NotFoundError('Order');
    if (role && !ADMIN_ROLES.includes(role) && order.user_id !== userId) throw new ForbiddenError();
    if (!role && order.user_id !== userId) throw new ForbiddenError();
    const items = await orderRepository.findItemsByOrderId(id);
    return { ...order, items };
  },

  transitionStatus: async (id: number, newStatus: string) => {
    const order = await orderRepository.findById(id);
    if (!order) throw new NotFoundError('Order');
    const allowed = ORDER_TRANSITIONS[order.status];
    if (!allowed || !allowed.includes(newStatus)) throw new InvalidStateTransitionError(order.status, newStatus);

    if (newStatus === 'cancelled') {
      const items = await orderRepository.findItemsByOrderId(id);
      for (const item of items) await inventoryService.release(item.product_id, item.quantity);
    }

    const updated = await orderRepository.updateStatus(id, newStatus);
    broadcast.orderUpdate(id, newStatus, order.user_id);
    return updated;
  },
};
