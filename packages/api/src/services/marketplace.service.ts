import { logger } from '../utils/logger.js';
import { AppError } from '../utils/errors.js';
import db from '../config/database.js';
import { productRepository } from '../repositories/product.repository.js';

// Coupang Wing API (Mock — 실제 연동시 API 키 필요)
const COUPANG_API = 'https://api-gateway.coupang.com/v2/providers/openapi/apis/api';

export const marketplaceService = {
  syncProduct: async (productId: number) => {
    const product = await productRepository.findById(productId);
    if (!product) throw new AppError(404, 'Product not found');

    // Mock: 실제로는 Coupang Wing API 호출
    logger.info({ productId, name: product.name }, 'Product synced to Coupang (mock)');
    return { productId, coupangItemId: `CPG_${productId}`, status: 'synced' };
  },

  receiveOrder: async (coupangOrderData: { coupangOrderId: string; items: { productId: number; quantity: number; price: number }[] }) => {
    // Coupang 주문을 Inventrix 주문으로 변환
    const { coupangOrderId, items } = coupangOrderData;

    // 마켓플레이스 전용 시스템 사용자 (admin)
    const systemUser = await db.query("SELECT id FROM users WHERE role = 'admin' LIMIT 1");
    const userId = systemUser.rows[0]?.id || 1;

    let subtotal = 0;
    for (const item of items) subtotal += item.price * item.quantity;
    const gst = Math.round(subtotal * 0.10 * 100) / 100;
    const total = Math.round((subtotal + gst) * 100) / 100;

    const order = await db.query(
      "INSERT INTO orders (user_id, subtotal, gst, total, status, cancel_reason) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
      [userId, subtotal, gst, total, 'confirmed', `coupang:${coupangOrderId}`]
    );

    for (const item of items) {
      await db.query('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1,$2,$3,$4)', [order.rows[0].id, item.productId, item.quantity, item.price]);
    }

    logger.info({ coupangOrderId, inventrixOrderId: order.rows[0].id }, 'Coupang order received');
    return { inventrixOrderId: order.rows[0].id, coupangOrderId, status: 'confirmed' };
  },

  syncShipmentStatus: async (orderId: number) => {
    const shipment = await db.query('SELECT * FROM shipments WHERE order_id = $1 ORDER BY id DESC LIMIT 1', [orderId]);
    if (!shipment.rows[0]) throw new AppError(404, 'Shipment not found');

    // Mock: 실제로는 Coupang API로 송장 전송
    logger.info({ orderId, trackingNumber: shipment.rows[0].tracking_number }, 'Shipment synced to Coupang (mock)');
    return { orderId, trackingNumber: shipment.rows[0].tracking_number, status: 'synced' };
  },
};
