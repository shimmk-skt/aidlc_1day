import { useState } from 'react';
import { useOrders } from '../hooks/queries/useOrders';
import { updateOrderStatus } from '../api/orders';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '../context/ToastContext';
import { formatCurrency, formatDateTime } from '../utils/format';
import { ORDER_STATUS_LABEL } from '../utils/constants';
import Badge from '../components/Badge';
import LoadingSpinner from '../components/LoadingSpinner';
import type { OrderStatus } from '../types/order';

const STATUS_TRANSITIONS: Partial<Record<OrderStatus, OrderStatus[]>> = {
  PENDING: ['CONFIRMED', 'CANCELLED'], CONFIRMED: ['PROCESSING', 'ON_HOLD', 'CANCELLED'],
  ON_HOLD: ['CONFIRMED', 'CANCELLED'], PROCESSING: ['PICKED', 'BACKORDERED'],
  BACKORDERED: ['PROCESSING', 'CANCELLED'], PICKED: ['PACKED'], PACKED: ['SHIPPED'],
  SHIPPED: ['DELIVERED'], DELIVERED: ['RETURN_INITIATED'], RETURN_INITIATED: ['RETURN_RECEIVED'],
  RETURN_RECEIVED: ['REFUNDED', 'EXCHANGED'],
};

export default function AdminOrders() {
  const { data: orders, isLoading } = useOrders();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [filter, setFilter] = useState<string>('');

  const filtered = orders?.filter(o => !filter || o.status === filter);

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try { await updateOrderStatus(orderId, newStatus); queryClient.invalidateQueries({ queryKey: ['orders'] }); showToast('주문 상태가 변경되었습니다', 'success'); }
    catch { showToast('상태 변경에 실패했습니다', 'error'); }
  };

  if (isLoading) return <div className="flex justify-center p-12"><LoadingSpinner /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold">주문 관리</h1>
        <select value={filter} onChange={e => setFilter(e.target.value)} className="border rounded-lg px-3 py-2 text-sm" data-testid="admin-orders-filter" aria-label="상태 필터">
          <option value="">전체 상태</option>
          {Object.entries(ORDER_STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>
      <div className="bg-white rounded-lg border overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead className="bg-gray-50"><tr><th className="text-left px-4 py-3 text-sm">주문 #</th><th className="text-left px-4 py-3 text-sm">일시</th><th className="text-left px-4 py-3 text-sm">금액</th><th className="text-left px-4 py-3 text-sm">상태</th><th className="text-left px-4 py-3 text-sm">액션</th></tr></thead>
          <tbody>
            {filtered?.map(order => {
              const transitions = STATUS_TRANSITIONS[order.status] || [];
              return (
                <tr key={order.id} className="border-t" data-testid={`admin-order-${order.id}`}>
                  <td className="px-4 py-3 font-medium">#{order.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{formatDateTime(order.createdAt)}</td>
                  <td className="px-4 py-3 font-bold">{formatCurrency(order.totalAmount)}</td>
                  <td className="px-4 py-3"><Badge status={order.status} /></td>
                  <td className="px-4 py-3">
                    {transitions.length > 0 && (
                      <select onChange={e => { if (e.target.value) handleStatusChange(order.id, e.target.value); e.target.value = ''; }} defaultValue="" className="border rounded px-2 py-1 text-xs" data-testid={`admin-order-status-${order.id}`}>
                        <option value="">상태 변경</option>
                        {transitions.map(s => <option key={s} value={s}>{ORDER_STATUS_LABEL[s]}</option>)}
                      </select>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
