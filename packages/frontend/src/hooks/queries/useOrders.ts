import { useQuery } from '@tanstack/react-query';
import { fetchOrders, fetchOrder } from '../../api/orders';

export const useOrders = () => useQuery({ queryKey: ['orders'], queryFn: fetchOrders });
export const useOrder = (id: number) => useQuery({ queryKey: ['orders', id], queryFn: () => fetchOrder(id), enabled: !!id });
