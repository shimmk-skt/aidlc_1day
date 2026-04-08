import type { Return, ReturnReason } from '../types/returns';

export const createReturn = (orderId: number, reason: ReturnReason, description?: string, photos?: File[]) => {
  const formData = new FormData();
  formData.append('orderId', String(orderId));
  formData.append('reason', reason);
  if (description) formData.append('description', description);
  photos?.forEach(p => formData.append('photos', p));
  return fetch('/api/returns', { method: 'POST', body: formData, credentials: 'include' })
    .then(async res => { if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message || '반품 신청에 실패했습니다'); return res.json() as Promise<Return>; });
};
