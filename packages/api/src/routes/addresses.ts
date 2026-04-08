import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { addressService } from '../services/address.service.js';
import { jsonApiSuccess, jsonApiList } from '../utils/json-api.js';

const router = Router();

router.get('/', authenticate, async (req: AuthRequest, res, next) => {
  try { res.json(jsonApiList(await addressService.findByUser(req.user!.id))); }
  catch (e) { next(e); }
});

router.post('/', authenticate,
  body('recipient_name').isString().trim().isLength({ min: 1, max: 100 }),
  body('address_line1').isString().trim().isLength({ min: 1, max: 255 }),
  body('city').isString().trim().isLength({ min: 1, max: 100 }),
  body('postal_code').isString().trim().isLength({ min: 1, max: 20 }),
  validate,
  async (req: AuthRequest, res, next) => {
    try { res.status(201).json(jsonApiSuccess(await addressService.create(req.user!.id, req.body))); }
    catch (e) { next(e); }
  }
);

router.delete('/:id', authenticate, async (req: AuthRequest, res, next) => {
  try { await addressService.delete(parseInt(req.params.id), req.user!.id); res.status(204).send(); }
  catch (e) { next(e); }
});

export default router;
