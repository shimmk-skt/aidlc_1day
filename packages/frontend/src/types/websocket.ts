import type { OrderStatus } from './order';

export type WSEvent =
  | { type: 'inventory_update'; productId: number; stock: number }
  | { type: 'order_update'; orderId: number; status: OrderStatus }
  | { type: 'new_order'; orderId: number }
  | { type: 'low_stock_alert'; productId: number; productName: string; stock: number }
  | { type: 'reorder_alert'; productId: number; productName: string; suggestedQty: number };
