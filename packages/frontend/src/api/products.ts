import { apiClient } from './client';
import type { Product } from '../types/product';

export const fetchProducts = (search?: string, category?: string) => {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (category) params.set('category', category);
  return apiClient<Product[]>(`/api/products?${params}`);
};

export const fetchProduct = (id: number) => apiClient<Product>(`/api/products/${id}`);

export const updateProduct = (id: number, data: Partial<Product>) =>
  apiClient<Product>(`/api/products/${id}`, { method: 'PUT', body: JSON.stringify(data) });
