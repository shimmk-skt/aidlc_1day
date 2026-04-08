import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate } from '../../src/utils/format';

describe('formatCurrency', () => {
  it('formats KRW', () => { expect(formatCurrency(15000)).toContain('15,000'); });
  it('formats zero', () => { expect(formatCurrency(0)).toContain('0'); });
});

describe('formatDate', () => {
  it('formats date string', () => { const result = formatDate('2026-04-08T12:00:00Z'); expect(result).toContain('2026'); });
});
