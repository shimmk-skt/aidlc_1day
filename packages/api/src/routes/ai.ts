import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth.js';
import { aiService } from '../services/ai.service.js';
import { jsonApiSuccess } from '../utils/json-api.js';
import { aiLimiter } from '../middleware/rate-limit.js';

const router = Router();

router.post('/inventory-qa', authenticate, requireAdmin, aiLimiter,
  body('question').isString().trim().isLength({ min: 1, max: 500 }),
  validate,
  async (req: AuthRequest, res, next) => {
    try { res.json(jsonApiSuccess({ answer: await aiService.askInventoryQuestion(req.body.question) })); }
    catch (e) { next(e); }
  }
);

router.post('/demand-narrative', authenticate, requireAdmin, aiLimiter,
  body('days').optional().isInt({ min: 7, max: 365 }),
  validate,
  async (req: AuthRequest, res, next) => {
    try { res.json(jsonApiSuccess({ narrative: await aiService.generateDemandNarrative(req.body.days || 30) })); }
    catch (e) { next(e); }
  }
);

router.post('/generate-description', authenticate, requireAdmin, aiLimiter,
  body('name').isString().trim().notEmpty(),
  body('category').isString().trim(),
  body('attributes').isObject(),
  validate,
  async (req: AuthRequest, res, next) => {
    try { res.json(jsonApiSuccess({ description: await aiService.generateProductDescription(req.body.name, req.body.category, req.body.attributes) })); }
    catch (e) { next(e); }
  }
);

export default router;
