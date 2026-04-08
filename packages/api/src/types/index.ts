export interface AuthUser {
  id: number;
  email: string;
  role: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'picked' | 'packed' | 'shipped' | 'delivered' | 'cancelled' | 'on_hold' | 'backordered' | 'return_initiated' | 'return_received' | 'refunded' | 'exchanged';

export const ORDER_TRANSITIONS: Record<string, string[]> = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['processing', 'on_hold', 'cancelled'],
  on_hold: ['confirmed', 'cancelled'],
  processing: ['picked', 'backordered', 'cancelled'],
  backordered: ['processing', 'cancelled'],
  picked: ['packed'],
  packed: ['shipped'],
  shipped: ['delivered'],
  delivered: ['return_initiated'],
  return_initiated: ['return_received'],
  return_received: ['refunded', 'exchanged'],
};
