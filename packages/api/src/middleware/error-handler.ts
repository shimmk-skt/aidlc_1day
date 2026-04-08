import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';
import { env } from '../config/env.js';
import { jsonApiError } from '../utils/json-api.js';

export const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction) => {
  const requestId = (req as any).requestId;
  if (err instanceof AppError) {
    logger.warn({ err: err.message, statusCode: err.statusCode, requestId }, 'App error');
    return res.status(err.statusCode).json(jsonApiError(err.statusCode, err.name, err.message));
  }
  logger.error({ err, requestId }, 'Unhandled error');
  res.status(500).json(jsonApiError(500, 'InternalServerError', env.nodeEnv === 'production' ? 'Internal server error' : err.message));
};
