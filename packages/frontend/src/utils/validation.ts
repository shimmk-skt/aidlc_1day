const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^01[016789]-?\d{3,4}-?\d{4}$/;

export function validateEmail(email: string): string | null {
  if (!email) return '이메일을 입력해 주세요';
  if (email.length > 255) return '이메일은 255자 이하여야 합니다';
  if (!EMAIL_RE.test(email)) return '올바른 이메일 형식이 아닙니다';
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return '비밀번호를 입력해 주세요';
  if (password.length < 8) return '비밀번호는 8자 이상이어야 합니다';
  if (!/[a-zA-Z]/.test(password) || !/\d/.test(password)) return '영문과 숫자를 모두 포함해야 합니다';
  return null;
}

export function validateName(name: string): string | null {
  if (!name) return '이름을 입력해 주세요';
  if (name.length < 2) return '이름은 2자 이상이어야 합니다';
  if (name.length > 100) return '이름은 100자 이하여야 합니다';
  return null;
}

export function validatePhone(phone: string): string | null {
  if (!phone) return '전화번호를 입력해 주세요';
  if (!PHONE_RE.test(phone)) return '올바른 전화번호 형식이 아닙니다 (010-XXXX-XXXX)';
  return null;
}

export function validateRequired(value: string, fieldName: string): string | null {
  if (!value.trim()) return `${fieldName}을(를) 입력해 주세요`;
  return null;
}
