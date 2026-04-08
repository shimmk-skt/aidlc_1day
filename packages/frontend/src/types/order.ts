export type OrderStatus =
  | 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'PICKED' | 'PACKED'
  | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'ON_HOLD' | 'BACKORDERED'
  | 'RETURN_INITIATED' | 'RETURN_RECEIVED' | 'REFUNDED' | 'EXCHANGED';

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productImageUrl: string;
  quantity: number;
  price: number;
}

export interface StatusHistoryEntry {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface Order {
  id: number;
  userId: number;
  status: OrderStatus;
  totalAmount: number;
  items: OrderItem[];
  shippingAddress?: Address;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
  statusHistory: StatusHistoryEntry[];
}

import type { Address } from './address';
