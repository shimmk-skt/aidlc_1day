import { apiClient } from './client';
import type { Address } from '../types/address';

export const fetchAddresses = () => apiClient<Address[]>('/api/addresses');
export const createAddress = (data: Omit<Address, 'id' | 'userId'>) =>
  apiClient<Address>('/api/addresses', { method: 'POST', body: JSON.stringify(data) });
export const updateAddress = (id: number, data: Partial<Address>) =>
  apiClient<Address>(`/api/addresses/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteAddress = (id: number) =>
  apiClient<void>(`/api/addresses/${id}`, { method: 'DELETE' });
export const setDefaultAddress = (id: number) =>
  apiClient<void>(`/api/addresses/${id}/default`, { method: 'PUT' });
