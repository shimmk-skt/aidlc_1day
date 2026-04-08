import { Router } from 'express';
import { body, param } from 'express-validator';
import { validate } from '../middleware/validate.js';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth.js';
import { returnService } from '../services/return.service.js';
import { jsonApiSuccess } from '../utils/json-api.js';

const router = Router();

router.post('/', authenticate,
  body('orderId').isInt({ min: 1 }),
  body('reason').isIn(['defective', 'wrong_item', 'changed_mind', 'other']),
  validate,
  async (req: AuthRequest, res, next) => {
    try {
      const result = await returnService.initiate(req.body.orderId, req.user!.id, req.body.reason);
      res.status(201).json(jsonApiSuccess(result));
    } catch (e) { next(e); }
  }
);

router.patch('/:id/receive', authenticate, requireAdmin,
  param('id').isInt(),
  validate,
  async (_req: AuthRequest, res, next) => {
    try {
      const result = await returnService.receiveAndRefund(parseInt(_req.params.id));
      res.json(jsonApiSuccess(result));
    } catch (e) { next(e); }
  }
);

export default router;
