import { Router } from 'express';
import { body, param } from 'express-validator';
import { validate } from '../middleware/validate.js';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth.js';
import { orderService } from '../services/order.service.js';
import { jsonApiSuccess, jsonApiList } from '../utils/json-api.js';

const router = Router();

router.get('/', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const orders = req.user?.role === 'admin' || req.user?.role === 'operations_manager'
      ? await orderService.findAll()
      : await orderService.findByUser(req.user!.id);
    res.json(jsonApiList(orders));
  } catch (e) { next(e); }
});

router.get('/:id', authenticate, param('id').isInt(), validate, async (req: AuthRequest, res, next) => {
  try { res.json(jsonApiSuccess(await orderService.findById(parseInt(req.params.id), req.user?.id, req.user?.role))); }
  catch (e) { next(e); }
});

router.post('/', authenticate,
  body('items').isArray({ min: 1 }),
  body('items.*.product_id').isInt({ min: 1 }),
  body('items.*.quantity').isInt({ min: 1, max: 1000 }),
  validate,
  async (req: AuthRequest, res, next) => {
    try { res.status(201).json(jsonApiSuccess(await orderService.create(req.user!.id, req.body.items))); }
    catch (e) { next(e); }
  }
);

router.patch('/:id/status', authenticate, requireAdmin,
  param('id').isInt(),
  body('status').isString().notEmpty(),
  validate,
  async (req: AuthRequest, res, next) => {
    try { res.json(jsonApiSuccess(await orderService.transitionStatus(parseInt(req.params.id), req.body.status))); }
    catch (e) { next(e); }
  }
);

export default router;
