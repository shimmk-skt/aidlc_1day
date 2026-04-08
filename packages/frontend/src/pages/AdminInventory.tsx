import { useState } from 'react';
import { useProducts } from '../hooks/queries/useProducts';
import { useForecast } from '../hooks/queries/useForecast';
import { updateProduct } from '../api/products';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '../context/ToastContext';
import { formatCurrency } from '../utils/format';
import LoadingSpinner from '../components/LoadingSpinner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export default function AdminInventory() {
  const { data: products, isLoading } = useProducts();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { data: forecast } = useForecast(selectedId);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editStock, setEditStock] = useState(0);

  const handleSaveStock = async (id: number) => {
    try { await updateProduct(id, { stock: editStock }); queryClient.invalidateQueries({ queryKey: ['products'] }); setEditingId(null); showToast('재고가 수정되었습니다', 'success'); }
    catch { showToast('재고 수정에 실패했습니다', 'error'); }
  };

  if (isLoading) return <div className="flex justify-center p-12"><LoadingSpinner /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">재고 관리</h1>
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-lg border overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead className="bg-gray-50"><tr><th className="text-left px-4 py-3 text-sm">상품</th><th className="text-left px-4 py-3 text-sm">가격</th><th className="text-left px-4 py-3 text-sm">재고</th><th className="px-4 py-3 text-sm">예측</th></tr></thead>
            <tbody>
              {products?.map(p => (
                <tr key={p.id} className={`border-t hover:bg-gray-50 ${p.stock === 0 ? 'bg-red-50' : p.stock < 10 ? 'bg-yellow-50' : ''}`} data-testid={`inventory-row-${p.id}`}>
                  <td className="px-4 py-3 font-medium">{p.name}</td>
                  <td className="px-4 py-3 text-sm">{formatCurrency(p.price)}</td>
                  <td className="px-4 py-3">
                    {editingId === p.id ? (
                      <div className="flex items-center gap-1">
                        <input type="number" value={editStock} onChange={e => setEditStock(Number(e.target.value))} className="w-16 border rounded px-2 py-1 text-sm" data-testid={`inventory-edit-${p.id}`} />
                        <button onClick={() => handleSaveStock(p.id)} className="text-green-600 text-xs">✓</button>
                        <button onClick={() => setEditingId(null)} className="text-red-600 text-xs">✕</button>
                      </div>
                    ) : (
                      <button onClick={() => { setEditingId(p.id); setEditStock(p.stock); }} className={`px-2 py-0.5 rounded text-xs font-medium cursor-pointer ${p.stock > 10 ? 'bg-green-100 text-green-700' : p.stock > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`} data-testid={`inventory-stock-${p.id}`}>{p.stock}</button>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center"><button onClick={() => setSelectedId(p.id)} className="text-primary-500 text-xs hover:underline" data-testid={`inventory-forecast-${p.id}`}>📊</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <h2 className="font-bold mb-3">수요 예측</h2>
          {forecast ? (
            <div>
              <p className="text-sm mb-1"><strong>{forecast.productName}</strong></p>
              <p className="text-xs text-gray-500 mb-3">현재 재고: {forecast.currentStock} | ROP: {forecast.reorderPoint} | 추천 발주: {forecast.suggestedOrderQty}</p>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={forecast.dailyForecast}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="quantity" stroke="#667eea" strokeWidth={2} />
                  <ReferenceLine y={forecast.reorderPoint} stroke="red" strokeDasharray="3 3" label="ROP" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : <p className="text-gray-400 text-sm">상품을 선택하면 수요 예측을 표시합니다.</p>}
        </div>
      </div>
    </div>
  );
}
