import { Router } from 'express';
import { body, param } from 'express-validator';
import { validate } from '../middleware/validate.js';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth.js';
import { marketplaceService } from '../services/marketplace.service.js';
import { jsonApiSuccess } from '../utils/json-api.js';

const router = Router();

router.post('/sync-product/:productId', authenticate, requireAdmin,
  param('productId').isInt(),
  validate,
  async (req: AuthRequest, res, next) => {
    try { res.json(jsonApiSuccess(await marketplaceService.syncProduct(parseInt(req.params.productId)))); }
    catch (e) { next(e); }
  }
);

router.post('/receive-order', authenticate, requireAdmin,
  body('coupangOrderId').isString().notEmpty(),
  body('items').isArray({ min: 1 }),
  body('items.*.productId').isInt({ min: 1 }),
  body('items.*.quantity').isInt({ min: 1 }),
  body('items.*.price').isFloat({ min: 0.01 }),
  validate,
  async (req: AuthRequest, res, next) => {
    try { res.status(201).json(jsonApiSuccess(await marketplaceService.receiveOrder(req.body))); }
    catch (e) { next(e); }
  }
);

router.post('/sync-shipment/:orderId', authenticate, requireAdmin,
  param('orderId').isInt(),
  validate,
  async (req: AuthRequest, res, next) => {
    try { res.json(jsonApiSuccess(await marketplaceService.syncShipmentStatus(parseInt(req.params.orderId)))); }
    catch (e) { next(e); }
  }
);

export default router;
