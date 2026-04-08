import { orderService } from './order.service.js';
import { inventoryService } from './inventory.service.js';
import { paymentService } from './payment.service.js';
import { broadcast } from '../config/socket.js';
import { AppError, NotFoundError } from '../utils/errors.js';
import { returnRepository } from '../repositories/return.repository.js';
import { orderRepository } from '../repositories/order.repository.js';

export const returnService = {
  initiate: async (orderId: number, userId: number, reason: string) => {
    const order = await orderService.findById(orderId, userId);
    if (order.status !== 'delivered') throw new AppError(400, 'Returns only allowed for delivered orders');
    const ret = await returnRepository.create(orderId, reason);
    await orderService.transitionStatus(orderId, 'return_initiated');
    broadcast.orderUpdate(orderId, 'return_initiated', order.user_id);
    return ret;
  },

  receiveAndRefund: async (returnId: number) => {
    const returnRecord = await returnRepository.findById(returnId);
    if (!returnRecord) throw new NotFoundError('Return');

    await returnRepository.updateStatus(returnId, 'received');
    await orderService.transitionStatus(returnRecord.order_id, 'return_received');

    const items = await orderRepository.findItemsByOrderId(returnRecord.order_id);
    for (const item of items) await inventoryService.release(item.product_id, item.quantity);

    const payment = await paymentService.findByOrderId(returnRecord.order_id);
    if (payment) await paymentService.refund(payment.payment_key);

    await returnRepository.updateStatus(returnId, 'refunded');
    await orderService.transitionStatus(returnRecord.order_id, 'refunded');
    broadcast.orderUpdate(returnRecord.order_id, 'refunded', returnRecord.user_id);
    return { returnId, status: 'refunded' };
  },

  findByOrderId: (orderId: number) => returnRepository.findByOrderId(orderId),
};
