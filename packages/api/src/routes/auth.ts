import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';
import { authLimiter } from '../middleware/rate-limit.js';
import { authService } from '../services/auth.service.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { jsonApiSuccess } from '../utils/json-api.js';

const router = Router();

router.post('/login', authLimiter,
  body('email').isEmail().normalizeEmail(),
  body('password').isString().notEmpty(),
  validate,
  async (req, res, next) => {
    try { res.json(jsonApiSuccess(await authService.login(req.body.email, req.body.password))); }
    catch (e) { next(e); }
  }
);

router.post('/register', authLimiter,
  body('email').isEmail().normalizeEmail().isLength({ max: 255 }),
  body('password').isString().isLength({ min: 8, max: 128 }),
  body('name').isString().trim().isLength({ min: 1, max: 100 }),
  validate,
  async (req, res, next) => {
    try { res.status(201).json(jsonApiSuccess(await authService.register(req.body.email, req.body.password, req.body.name))); }
    catch (e) { next(e); }
  }
);

router.post('/refresh',
  body('refreshToken').isString().notEmpty(),
  validate,
  async (req, res, next) => {
    try { res.json(jsonApiSuccess(await authService.refreshToken(req.body.refreshToken))); }
    catch (e) { next(e); }
  }
);

router.post('/logout', authenticate, async (req: AuthRequest, res, next) => {
  try {
    if (req.body.refreshToken) await authService.logout(req.body.refreshToken);
    res.json(jsonApiSuccess({ message: 'Logged out' }));
  } catch (e) { next(e); }
});

export default router;
