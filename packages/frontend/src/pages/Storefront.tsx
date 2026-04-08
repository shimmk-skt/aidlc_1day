import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/queries/useProducts';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { formatCurrency } from '../utils/format';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Storefront() {
  const [search, setSearch] = useState('');
  const { data: products, isLoading } = useProducts(search || undefined);
  const { addItem } = useCart();
  const { showToast } = useToast();

  if (isLoading) return <div className="flex justify-center p-12"><LoadingSpinner /></div>;

  return (
    <div>
      <div className="mb-6">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="상품 검색..." className="w-full md:w-80 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500" data-testid="storefront-search" aria-label="상품 검색" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products?.map(p => (
          <div key={p.id} className="bg-white rounded-xl shadow-sm border hover:shadow-md transition overflow-hidden" data-testid={`product-card-${p.id}`}>
            <Link to={`/products/${p.id}`}>
              <img src={p.imageUrl} alt={p.name} className="w-full h-48 object-cover" loading="lazy" />
            </Link>
            <div className="p-4">
              <Link to={`/products/${p.id}`} className="font-medium text-gray-800 hover:text-primary-500 transition">{p.name}</Link>
              <p className="text-primary-600 font-bold mt-1">{formatCurrency(p.price)}</p>
              <p className={`text-xs mt-1 ${p.stock > 10 ? 'text-green-600' : p.stock > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                {p.stock > 0 ? `재고 ${p.stock}개` : '품절'}
              </p>
              <button onClick={() => { addItem(p); showToast('장바구니에 추가했습니다', 'success'); }} disabled={p.stock === 0} className="mt-3 w-full bg-primary-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-primary-600 transition disabled:opacity-40 disabled:cursor-not-allowed" data-testid={`add-to-cart-${p.id}`}>
                {p.stock > 0 ? '장바구니 담기' : '품절'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
