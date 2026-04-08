import { useParams, useNavigate } from 'react-router-dom';
import { useOrder } from '../hooks/queries/useOrders';
import { cancelOrder, reorder } from '../api/orders';
import { useToast } from '../context/ToastContext';
import { useQueryClient } from '@tanstack/react-query';
import { formatCurrency, formatDateTime } from '../utils/format';
import Badge from '../components/Badge';
import OrderTimeline from '../components/OrderTimeline';
import LoadingSpinner from '../components/LoadingSpinner';

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading } = useOrder(Number(id));
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  if (isLoading || !order) return <div className="flex justify-center p-12"><LoadingSpinner /></div>;

  const canCancel = ['PENDING', 'CONFIRMED', 'BACKORDERED'].includes(order.status);
  const canReturn = order.status === 'DELIVERED';
  const canReorder = ['DELIVERED', 'CANCELLED', 'REFUNDED'].includes(order.status);

  const handleCancel = async () => {
    try { await cancelOrder(order.id); queryClient.invalidateQueries({ queryKey: ['orders'] }); showToast('주문이 취소되었습니다', 'success'); }
    catch { showToast('주문 취소에 실패했습니다', 'error'); }
  };

  const handleReorder = async () => {
    try { await reorder(order.id); navigate('/checkout'); showToast('재주문이 생성되었습니다', 'success'); }
    catch { showToast('재주문에 실패했습니다', 'error'); }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">주문 #{order.id}</h1>
        <Badge status={order.status} />
      </div>
      <div className="bg-white rounded-lg border p-6 mb-4">
        <h2 className="font-bold mb-4">주문 상태</h2>
        <OrderTimeline history={order.statusHistory} currentStatus={order.status} />
      </div>
      <div className="bg-white rounded-lg border p-6 mb-4">
        <h2 className="font-bold mb-3">주문 상품</h2>
        {order.items.map(item => (
          <div key={item.id} className="flex items-center gap-4 py-3 border-b last:border-0">
            <img src={item.productImageUrl} alt={item.productName} className="w-16 h-16 object-cover rounded" />
            <div className="flex-1">
              <p className="font-medium">{item.productName}</p>
              <p className="text-sm text-gray-500">{item.quantity}개 × {formatCurrency(item.price)}</p>
            </div>
            <p className="font-bold">{formatCurrency(item.price * item.quantity)}</p>
          </div>
        ))}
        <div className="border-t mt-3 pt-3 flex justify-between font-bold text-lg">
          <span>합계</span><span>{formatCurrency(order.totalAmount)}</span>
        </div>
      </div>
      <div className="flex gap-3">
        {canCancel && <button onClick={handleCancel} className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition" data-testid="order-cancel">주문 취소</button>}
        {canReturn && <button onClick={() => navigate(`/my/returns/${order.id}`)} className="px-4 py-2 border border-yellow-300 text-yellow-700 rounded-lg hover:bg-yellow-50 transition" data-testid="order-return">반품 신청</button>}
        {canReorder && <button onClick={handleReorder} className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition" data-testid="order-reorder">재주문</button>}
      </div>
    </div>
  );
}
