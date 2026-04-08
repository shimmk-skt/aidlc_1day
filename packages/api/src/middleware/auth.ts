import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { UnauthorizedError, ForbiddenError } from '../utils/errors.js';
import type { AuthUser } from '../types/index.js';

export interface AuthRequest extends Request {
  user?: AuthUser;
}

export const authenticate = (req: AuthRequest, _res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return next(new UnauthorizedError());
  try {
    req.user = jwt.verify(token, env.jwtSecret) as AuthUser;
    next();
  } catch {
    next(new UnauthorizedError('Invalid token'));
  }
};

export const requireAdmin = (req: AuthRequest, _res: Response, next: NextFunction) => {
  if (!req.user || !['admin', 'operations_manager', 'inventory_manager', 'finance_manager'].includes(req.user.role)) {
    return next(new ForbiddenError('Admin access required'));
  }
  next();
};

export const requireRole = (...roles: string[]) => (req: AuthRequest, _res: Response, next: NextFunction) => {
  if (!req.user || !roles.includes(req.user.role)) return next(new ForbiddenError());
  next();
};
