import { ORDER_TRANSITIONS } from '../../src/types/index.js';

describe('Order State Machine', () => {
  test('pending can transition to confirmed or cancelled', () => {
    expect(ORDER_TRANSITIONS['pending']).toEqual(['confirmed', 'cancelled']);
  });

  test('shipped can only transition to delivered', () => {
    expect(ORDER_TRANSITIONS['shipped']).toEqual(['delivered']);
  });

  test('delivered can only transition to return_initiated', () => {
    expect(ORDER_TRANSITIONS['delivered']).toEqual(['return_initiated']);
  });

  test('invalid from-state returns undefined', () => {
    expect(ORDER_TRANSITIONS['nonexistent']).toBeUndefined();
  });

  test('cancelled has no transitions', () => {
    expect(ORDER_TRANSITIONS['cancelled']).toBeUndefined();
  });
});
