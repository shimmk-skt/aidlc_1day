import { useQuery } from '@tanstack/react-query';
import { fetchProducts, fetchProduct } from '../../api/products';

export const useProducts = (search?: string, category?: string) =>
  useQuery({ queryKey: ['products', search, category], queryFn: () => fetchProducts(search, category) });

export const useProduct = (id: number) =>
  useQuery({ queryKey: ['products', id], queryFn: () => fetchProduct(id), enabled: !!id });
