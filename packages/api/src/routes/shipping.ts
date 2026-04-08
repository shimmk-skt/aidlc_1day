import { Router } from 'express';
import { body, param } from 'express-validator';
import { validate } from '../middleware/validate.js';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth.js';
import { shippingService } from '../services/shipping.service.js';
import { orderService } from '../services/order.service.js';
import { broadcast } from '../config/socket.js';
import { jsonApiSuccess, jsonApiList } from '../utils/json-api.js';

const router = Router();

router.get('/rates', authenticate, async (_req, res, next) => {
  try { res.json(jsonApiList(await shippingService.getRates({ weight: 1, from: 'Seoul', to: 'Seoul' }))); }
  catch (e) { next(e); }
});

router.post('/shipments', authenticate, requireAdmin,
  body('orderId').isInt({ min: 1 }),
  body('carrier').isString().notEmpty(),
  body('trackingNumber').isString().notEmpty(),
  validate,
  async (req: AuthRequest, res, next) => {
    try {
      const shipment = await shippingService.createShipment(req.body.orderId, req.body.carrier, req.body.trackingNumber);
      await orderService.transitionStatus(req.body.orderId, 'shipped');
      const order = await orderService.findById(req.body.orderId, undefined, 'admin');
      broadcast.orderUpdate(req.body.orderId, 'shipped', order.user_id);
      res.status(201).json(jsonApiSuccess(shipment));
    } catch (e) { next(e); }
  }
);

router.get('/tracking/:trackingNumber', authenticate,
  param('trackingNumber').isString(),
  validate,
  async (req, res, next) => {
    try { res.json(jsonApiSuccess(await shippingService.getTracking(req.params.trackingNumber, req.query.carrier as string || ''))); }
    catch (e) { next(e); }
  }
);

// Webhook from carrier
router.post('/webhook', async (req, res, next) => {
  try {
    const { shipmentId, status } = req.body;
    if (shipmentId && status) {
      const shipment = await shippingService.updateStatus(shipmentId, status);
      if (status === 'delivered' && shipment) {
        await orderService.transitionStatus(shipment.order_id, 'delivered');
      }
    }
    res.json({ received: true });
  } catch (e) { next(e); }
});

export default router;
