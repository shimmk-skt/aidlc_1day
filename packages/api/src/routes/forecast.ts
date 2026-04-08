import { Router } from 'express';
import { param } from 'express-validator';
import { validate } from '../middleware/validate.js';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth.js';
import { forecastService } from '../services/forecast.service.js';
import { jsonApiSuccess, jsonApiList } from '../utils/json-api.js';

const router = Router();

router.get('/suggestions', authenticate, requireAdmin, async (_req: AuthRequest, res, next) => {
  try { res.json(jsonApiList(await forecastService.getReorderSuggestions())); }
  catch (e) { next(e); }
});

router.get('/:productId', authenticate, requireAdmin,
  param('productId').isInt(),
  validate,
  async (req: AuthRequest, res, next) => {
    try { res.json(jsonApiSuccess(await forecastService.getForecast(parseInt(req.params.productId)))); }
    catch (e) { next(e); }
  }
);

export default router;
