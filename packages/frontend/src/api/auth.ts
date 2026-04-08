import type { User } from '../types/auth';

export async function loginApi(email: string, password: string): Promise<{ user: User; accessToken: string }> {
  const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }), credentials: 'include' });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message || '로그인에 실패했습니다');
  return res.json();
}

export async function registerApi(email: string, password: string, name: string): Promise<{ user: User; accessToken: string }> {
  const res = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password, name }), credentials: 'include' });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message || '회원가입에 실패했습니다');
  return res.json();
}

export async function logoutApi(): Promise<void> {
  await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }).catch(() => {});
}
