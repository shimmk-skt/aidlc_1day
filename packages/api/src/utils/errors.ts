export class AppError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string) { super(400, message); this.name = 'ValidationError'; }
}

export class NotFoundError extends AppError {
  constructor(resource: string) { super(404, `${resource} not found`); this.name = 'NotFoundError'; }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Authentication required') { super(401, message); this.name = 'UnauthorizedError'; }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Access denied') { super(403, message); this.name = 'ForbiddenError'; }
}

export class ConflictError extends AppError {
  constructor(message: string) { super(409, message); this.name = 'ConflictError'; }
}

export class InsufficientStockError extends AppError {
  constructor(productId: number) { super(400, `Insufficient stock for product ${productId}`); this.name = 'InsufficientStockError'; }
}

export class InvalidStateTransitionError extends AppError {
  constructor(from: string, to: string) { super(400, `Invalid status transition: ${from} → ${to}`); this.name = 'InvalidStateTransitionError'; }
}
