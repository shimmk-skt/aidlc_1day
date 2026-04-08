import { Router } from 'express';
import { param } from 'express-validator';
import { validate } from '../middleware/validate.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { recommendationService } from '../services/recommendation.service.js';
import { jsonApiList } from '../utils/json-api.js';

const router = Router();

router.get('/personalized', authenticate, async (req: AuthRequest, res, next) => {
  try { res.json(jsonApiList(await recommendationService.getPersonalized(req.user!.id))); }
  catch (e) { next(e); }
});

router.get('/:productId/bought-together', authenticate,
  param('productId').isInt(),
  validate,
  async (req, res, next) => {
    try { res.json(jsonApiList(await recommendationService.getFrequentlyBoughtTogether(parseInt(req.params.productId)))); }
    catch (e) { next(e); }
  }
);

export default router;
