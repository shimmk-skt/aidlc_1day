import { AppError, ValidationError, NotFoundError, InsufficientStockError, InvalidStateTransitionError } from '../../src/utils/errors.js';

describe('Custom Errors', () => {
  test('AppError has statusCode and message', () => {
    const err = new AppError(400, 'Bad request');
    expect(err.statusCode).toBe(400);
    expect(err.message).toBe('Bad request');
  });

  test('ValidationError is 400', () => {
    const err = new ValidationError('Invalid input');
    expect(err.statusCode).toBe(400);
  });

  test('NotFoundError is 404', () => {
    const err = new NotFoundError('Product');
    expect(err.statusCode).toBe(404);
    expect(err.message).toBe('Product not found');
  });

  test('InsufficientStockError includes product id', () => {
    const err = new InsufficientStockError(42);
    expect(err.statusCode).toBe(400);
    expect(err.message).toContain('42');
  });

  test('InvalidStateTransitionError includes states', () => {
    const err = new InvalidStateTransitionError('pending', 'delivered');
    expect(err.message).toContain('pending');
    expect(err.message).toContain('delivered');
  });
});
