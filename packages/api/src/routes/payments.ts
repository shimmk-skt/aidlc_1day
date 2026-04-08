import { Router } from 'express';
import { body, param } from 'express-validator';
import { validate } from '../middleware/validate.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { paymentService } from '../services/payment.service.js';
import { orderService } from '../services/order.service.js';
import { inventoryService } from '../services/inventory.service.js';
import { broadcast } from '../config/socket.js';
import { jsonApiSuccess } from '../utils/json-api.js';
import { orderRepository } from '../repositories/order.repository.js';

const router = Router();

router.post('/confirm', authenticate,
  body('paymentKey').isString().notEmpty(),
  body('orderId').isInt({ min: 1 }),
  body('amount').isFloat({ min: 0.01 }),
  validate,
  async (req: AuthRequest, res, next) => {
    try {
      const result = await paymentService.confirmPayment(req.body.paymentKey, req.body.orderId, req.body.amount);
      await orderService.transitionStatus(req.body.orderId, 'confirmed');

      // Fix 5: reserved_qty → stock 확정
      const items = await orderRepository.findItemsByOrderId(req.body.orderId);
      for (const item of items) {
        await inventoryService.confirmReservation(item.product_id, item.quantity);
      }

      broadcast.orderUpdate(req.body.orderId, 'confirmed', req.user!.id);
      res.json(jsonApiSuccess(result));
    } catch (e) { next(e); }
  }
);

router.post('/:paymentKey/cancel', authenticate,
  param('paymentKey').isString(),
  body('reason').isString().notEmpty(),
  validate,
  async (req: AuthRequest, res, next) => {
    try {
      const result = await paymentService.cancelPayment(req.params.paymentKey, req.body.reason);
      res.json(jsonApiSuccess(result));
    } catch (e) { next(e); }
  }
);

export default router;
