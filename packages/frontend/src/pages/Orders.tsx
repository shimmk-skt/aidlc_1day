import { Link } from 'react-router-dom';
import { useOrders } from '../hooks/queries/useOrders';
import { formatCurrency, formatDate } from '../utils/format';
import Badge from '../components/Badge';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

export default function Orders() {
  const { data: orders, isLoading } = useOrders();

  if (isLoading) return <div className="flex justify-center p-12"><LoadingSpinner /></div>;
  if (!orders?.length) return <EmptyState icon="📦" message="주문 내역이 없습니다" actionLabel="쇼핑하러 가기" onAction={() => window.location.href = '/'} />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">주문 내역</h1>
      <div className="space-y-4">
        {orders.map(order => (
          <Link key={order.id} to={`/orders/${order.id}`} className="block bg-white rounded-lg border p-4 hover:shadow-md transition" data-testid={`order-card-${order.id}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">주문 #{order.id}</span>
              <Badge status={order.status} />
            </div>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>{formatDate(order.createdAt)}</span>
              <span className="font-bold text-gray-800">{formatCurrency(order.totalAmount)}</span>
            </div>
            <div className="mt-2 flex gap-2 overflow-x-auto">
              {order.items.slice(0, 3).map(item => (
                <img key={item.id} src={item.productImageUrl} alt={item.productName} className="w-12 h-12 object-cover rounded" />
              ))}
              {order.items.length > 3 && <span className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-500">+{order.items.length - 3}</span>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
