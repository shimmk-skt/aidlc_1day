import { describe, it, expect } from 'vitest';
import { validateEmail, validatePassword, validateName, validatePhone } from '../../src/utils/validation';

describe('validateEmail', () => {
  it('returns null for valid email', () => { expect(validateEmail('test@example.com')).toBeNull(); });
  it('returns error for empty', () => { expect(validateEmail('')).toBeTruthy(); });
  it('returns error for invalid format', () => { expect(validateEmail('notanemail')).toBeTruthy(); });
});

describe('validatePassword', () => {
  it('returns null for valid password', () => { expect(validatePassword('abc12345')).toBeNull(); });
  it('returns error for short password', () => { expect(validatePassword('abc1')).toBeTruthy(); });
  it('returns error for letters only', () => { expect(validatePassword('abcdefgh')).toBeTruthy(); });
  it('returns error for numbers only', () => { expect(validatePassword('12345678')).toBeTruthy(); });
});

describe('validateName', () => {
  it('returns null for valid name', () => { expect(validateName('홍길동')).toBeNull(); });
  it('returns error for single char', () => { expect(validateName('홍')).toBeTruthy(); });
});

describe('validatePhone', () => {
  it('returns null for valid phone', () => { expect(validatePhone('010-1234-5678')).toBeNull(); });
  it('returns error for invalid', () => { expect(validatePhone('123')).toBeTruthy(); });
});
