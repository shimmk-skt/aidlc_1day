import { Link } from 'react-router-dom';
import { useDashboard } from '../hooks/queries/useDashboard';
import { formatCurrency, formatDateTime } from '../utils/format';
import Badge from '../components/Badge';
import LoadingSpinner from '../components/LoadingSpinner';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const { data, isLoading } = useDashboard();

  if (isLoading || !data) return <div className="flex justify-center p-12"><LoadingSpinner /></div>;

  const kpiCards = [
    { label: '총 매출', value: formatCurrency(data.totalRevenue), icon: '💰' },
    { label: '총 주문', value: `${data.totalOrders}건`, icon: '📦' },
    { label: '대기 주문', value: `${data.pendingOrders}건`, icon: '⏳' },
    { label: '재고 회전율', value: `${data.inventoryKPIs.turnoverRate.toFixed(1)}x`, icon: '🔄' },
    { label: '품절 상품', value: `${data.inventoryKPIs.outOfStockCount}개`, icon: '🚫' },
    { label: '재고 부족', value: `${data.inventoryKPIs.lowStockCount}개`, icon: '⚠️' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">관리자 대시보드</h1>
        <div className="flex gap-2">
          <Link to="/admin/products" className="bg-white border px-3 py-1.5 rounded-lg text-sm hover:bg-gray-50">상품 관리</Link>
          <Link to="/admin/orders" className="bg-white border px-3 py-1.5 rounded-lg text-sm hover:bg-gray-50">주문 관리</Link>
          <Link to="/admin/inventory" className="bg-white border px-3 py-1.5 rounded-lg text-sm hover:bg-gray-50">재고 관리</Link>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {kpiCards.map(kpi => (
          <div key={kpi.label} className="bg-white rounded-lg border p-4 text-center" data-testid={`kpi-${kpi.label}`}>
            <span className="text-2xl">{kpi.icon}</span>
            <p className="text-lg font-bold mt-1">{kpi.value}</p>
            <p className="text-xs text-gray-500">{kpi.label}</p>
          </div>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border p-4">
          <h2 className="font-bold mb-3">매출 추이</h2>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={data.revenueChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: number) => formatCurrency(v)} />
              <Area type="monotone" dataKey="revenue" stroke="#667eea" fill="#667eea" fillOpacity={0.1} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <h2 className="font-bold mb-3">최근 주문</h2>
          <div className="space-y-2 max-h-[280px] overflow-y-auto">
            {data.recentOrders.map(order => (
              <Link key={order.id} to={`/admin/orders`} className="flex items-center justify-between p-2 rounded hover:bg-gray-50">
                <div>
                  <span className="text-sm font-medium">#{order.id}</span>
                  <span className="text-xs text-gray-500 ml-2">{formatDateTime(order.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold">{formatCurrency(order.totalAmount)}</span>
                  <Badge status={order.status} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
