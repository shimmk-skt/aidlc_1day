import { logger } from '../utils/logger.js';
import { env } from '../config/env.js';
import { AppError } from '../utils/errors.js';
import { paymentRepository } from '../repositories/payment.repository.js';

const TOSS_API = 'https://api.tosspayments.com/v1';
const tossHeaders = () => ({
  Authorization: `Basic ${Buffer.from(env.tossSecretKey + ':').toString('base64')}`,
  'Content-Type': 'application/json',
});

export const paymentService = {
  confirmPayment: async (paymentKey: string, orderId: number, amount: number) => {
    if (!env.tossSecretKey) {
      logger.warn('Toss secret key not configured — using mock payment');
      await paymentRepository.create(orderId, `mock_${paymentKey}`, 'mock', amount, 'succeeded');
      return { paymentKey: `mock_${paymentKey}`, status: 'succeeded' };
    }
    const res = await fetch(`${TOSS_API}/payments/confirm`, {
      method: 'POST', headers: tossHeaders(),
      body: JSON.stringify({ paymentKey, orderId: String(orderId), amount }),
    });
    if (!res.ok) { const err = await res.json(); throw new AppError(400, err.message || 'Payment confirmation failed'); }
    const data = await res.json();
    await paymentRepository.create(orderId, data.paymentKey, data.method, data.totalAmount, 'succeeded');
    return data;
  },

  cancelPayment: async (paymentKey: string, reason: string) => {
    if (!env.tossSecretKey) { await paymentRepository.updateStatus(`mock_${paymentKey}`, 'cancelled'); return { status: 'cancelled' }; }
    const res = await fetch(`${TOSS_API}/payments/${paymentKey}/cancel`, { method: 'POST', headers: tossHeaders(), body: JSON.stringify({ cancelReason: reason }) });
    if (!res.ok) throw new AppError(400, 'Payment cancellation failed');
    await paymentRepository.updateStatus(paymentKey, 'cancelled');
    return await res.json();
  },

  refund: async (paymentKey: string, amount?: number) => {
    if (!env.tossSecretKey) { await paymentRepository.updateStatus(`mock_${paymentKey}`, 'refunded'); return { status: 'refunded' }; }
    const body: Record<string, unknown> = { cancelReason: 'Customer refund' };
    if (amount) body.cancelAmount = amount;
    const res = await fetch(`${TOSS_API}/payments/${paymentKey}/cancel`, { method: 'POST', headers: tossHeaders(), body: JSON.stringify(body) });
    if (!res.ok) throw new AppError(400, 'Refund failed');
    await paymentRepository.updateStatus(paymentKey, 'refunded');
    return await res.json();
  },

  findByOrderId: (orderId: number) => paymentRepository.findByOrderId(orderId),
};
