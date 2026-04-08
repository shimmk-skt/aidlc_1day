import { apiClient } from './client';
import type { Order } from '../types/order';

export const fetchOrders = () => apiClient<Order[]>('/api/orders');
export const fetchOrder = (id: number) => apiClient<Order>(`/api/orders/${id}`);
export const createOrder = (items: { productId: number; quantity: number }[], addressId: number) =>
  apiClient<Order>('/api/orders', { method: 'POST', body: JSON.stringify({ items, addressId }) });
export const cancelOrder = (id: number) => apiClient<Order>(`/api/orders/${id}/cancel`, { method: 'PUT' });
export const reorder = (id: number) => apiClient<Order>(`/api/orders/${id}/reorder`, { method: 'POST' });
export const updateOrderStatus = (id: number, status: string) =>
  apiClient<Order>(`/api/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) });
export const fetchOrderTracking = (id: number) => apiClient<{ trackingNumber: string; status: string; history: { status: string; timestamp: string }[] }>(`/api/orders/${id}/tracking`);
