import { Router } from 'express';
import { body, param } from 'express-validator';
import { validate } from '../middleware/validate.js';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth.js';
import { productService } from '../services/product.service.js';
import { generateProductImage } from '../services/imageGenerator.js';
import { jsonApiSuccess, jsonApiList } from '../utils/json-api.js';

const router = Router();

router.get('/', async (_req, res, next) => {
  try { res.json(jsonApiList(await productService.findAll())); } catch (e) { next(e); }
});

router.get('/:id', param('id').isInt(), validate, async (req, res, next) => {
  try { res.json(jsonApiSuccess(await productService.findById(parseInt(req.params.id)))); } catch (e) { next(e); }
});

router.post('/', authenticate, requireAdmin,
  body('name').isString().trim().isLength({ min: 1, max: 255 }),
  body('description').isString().trim(),
  body('price').isFloat({ min: 0.01 }),
  body('stock').isInt({ min: 0 }),
  body('image_url').isString(),
  validate,
  async (req: AuthRequest, res, next) => {
    try { res.status(201).json(jsonApiSuccess(await productService.create(req.body))); } catch (e) { next(e); }
  }
);

router.put('/:id', authenticate, requireAdmin,
  param('id').isInt(),
  body('name').isString().trim().isLength({ min: 1, max: 255 }),
  body('description').isString().trim(),
  body('price').isFloat({ min: 0.01 }),
  body('stock').isInt({ min: 0 }),
  body('image_url').isString(),
  validate,
  async (req: AuthRequest, res, next) => {
    try { res.json(jsonApiSuccess(await productService.update(parseInt(req.params.id), req.body))); } catch (e) { next(e); }
  }
);

router.delete('/:id', authenticate, requireAdmin, param('id').isInt(), validate, async (req: AuthRequest, res, next) => {
  try { await productService.delete(parseInt(req.params.id)); res.status(204).send(); } catch (e) { next(e); }
});

router.post('/generate-image', authenticate, requireAdmin,
  body('productName').isString().notEmpty(),
  body('description').isString(),
  validate,
  async (req: AuthRequest, res, next) => {
    try { res.json(jsonApiSuccess({ imageUrl: await generateProductImage(req.body.productName, req.body.description) })); }
    catch (e) { next(e); }
  }
);

export default router;
