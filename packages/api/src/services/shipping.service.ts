import { logger } from '../utils/logger.js';
import { shipmentRepository } from '../repositories/shipment.repository.js';

export const shippingService = {
  getRates: async (_shipment: { weight: number; from: string; to: string }) => {
    return [
      { carrier: 'cj', name: 'CJ대한통운', estimatedDays: 2, price: 3000 },
      { carrier: 'hanjin', name: '한진택배', estimatedDays: 2, price: 2800 },
      { carrier: 'lotte', name: '롯데택배', estimatedDays: 3, price: 2500 },
    ];
  },

  createShipment: async (orderId: number, carrier: string, trackingNumber: string) => {
    const shipment = await shipmentRepository.create(orderId, carrier, trackingNumber);
    logger.info({ orderId, carrier, trackingNumber }, 'Shipment created');
    return shipment;
  },

  getTracking: async (trackingNumber: string, carrier: string) => {
    logger.info({ trackingNumber, carrier }, 'Tracking lookup');
    return {
      trackingNumber, carrier, status: 'in_transit',
      events: [{ timestamp: new Date().toISOString(), status: 'picked_up', location: '발송지', description: '상품 접수' }],
    };
  },

  updateStatus: async (shipmentId: number, status: string) => shipmentRepository.updateStatus(shipmentId, status),
  findByOrderId: (orderId: number) => shipmentRepository.findByOrderId(orderId),
};
