import { useProducts } from '../hooks/queries/useProducts';
import { formatCurrency } from '../utils/format';
import LoadingSpinner from '../components/LoadingSpinner';

export default function AdminProducts() {
  const { data: products, isLoading } = useProducts();

  if (isLoading) return <div className="flex justify-center p-12"><LoadingSpinner /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">상품 관리</h1>
      {/* 모바일: 카드 뷰 */}
      <div className="md:hidden space-y-3">
        {products?.map(p => (
          <div key={p.id} className="bg-white rounded-lg border p-4 flex gap-3">
            <img src={p.imageUrl} alt={p.name} className="w-16 h-16 object-cover rounded" />
            <div className="flex-1">
              <p className="font-medium">{p.name}</p>
              <p className="text-sm text-primary-600 font-bold">{formatCurrency(p.price)}</p>
              <p className={`text-xs ${p.stock > 10 ? 'text-green-600' : p.stock > 0 ? 'text-yellow-600' : 'text-red-600'}`}>재고: {p.stock}</p>
            </div>
          </div>
        ))}
      </div>
      {/* 데스크톱: 테이블 */}
      <div className="hidden md:block bg-white rounded-lg border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50"><tr><th className="text-left px-4 py-3 text-sm font-medium">상품</th><th className="text-left px-4 py-3 text-sm font-medium">가격</th><th className="text-left px-4 py-3 text-sm font-medium">재고</th></tr></thead>
          <tbody>
            {products?.map(p => (
              <tr key={p.id} className="border-t hover:bg-gray-50" data-testid={`admin-product-${p.id}`}>
                <td className="px-4 py-3 flex items-center gap-3"><img src={p.imageUrl} alt={p.name} className="w-10 h-10 object-cover rounded" /><span className="font-medium">{p.name}</span></td>
                <td className="px-4 py-3">{formatCurrency(p.price)}</td>
                <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded text-xs font-medium ${p.stock > 10 ? 'bg-green-100 text-green-700' : p.stock > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{p.stock}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
