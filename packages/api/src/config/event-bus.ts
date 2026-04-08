import { logger } from '../utils/logger.js';

// CloudEvents 표준 스키마
export interface DomainEvent {
  specversion: '1.0';
  type: string;
  source: string;
  id: string;
  time: string;
  data: Record<string, unknown>;
}

type EventHandler = (event: DomainEvent) => Promise<void>;
const handlers: Map<string, EventHandler[]> = new Map();

export const eventBus = {
  publish: async (type: string, source: string, data: Record<string, unknown>) => {
    const event: DomainEvent = {
      specversion: '1.0',
      type,
      source,
      id: crypto.randomUUID(),
      time: new Date().toISOString(),
      data,
    };
    logger.info({ eventType: type, eventId: event.id }, 'Event published');
    const eventHandlers = handlers.get(type) || [];
    await Promise.allSettled(eventHandlers.map(h => h(event)));
  },

  subscribe: (type: string, handler: EventHandler) => {
    const existing = handlers.get(type) || [];
    existing.push(handler);
    handlers.set(type, existing);
    logger.debug({ eventType: type }, 'Event handler registered');
  },
};

// Event types
export const Events = {
  ORDER_PLACED: 'com.inventrix.order.placed',
  ORDER_STATUS_CHANGED: 'com.inventrix.order.status_changed',
  INVENTORY_UPDATED: 'com.inventrix.inventory.updated',
  PAYMENT_COMPLETED: 'com.inventrix.payment.completed',
  SHIPMENT_CREATED: 'com.inventrix.shipment.created',
} as const;
