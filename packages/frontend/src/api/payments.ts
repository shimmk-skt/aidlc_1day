import { apiClient } from './client';

export const confirmPayment = (paymentKey: string, orderId: number, amount: number) =>
  apiClient<{ success: boolean }>('/api/payments/confirm', { method: 'POST', body: JSON.stringify({ paymentKey, orderId, amount }) });
