import { useParams, Link } from 'react-router-dom';
import { useProduct } from '../hooks/queries/useProducts';
import { useProductRecommendations } from '../hooks/queries/useRecommendations';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { formatCurrency } from '../utils/format';
import LoadingSpinner from '../components/LoadingSpinner';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading } = useProduct(Number(id));
  const { data: recs } = useProductRecommendations(Number(id));
  const { addItem } = useCart();
  const { showToast } = useToast();

  if (isLoading || !product) return <div className="flex justify-center p-12"><LoadingSpinner /></div>;

  return (
    <div>
      <div className="bg-white rounded-xl shadow-sm border p-6 flex flex-col md:flex-row gap-8">
        <img src={product.imageUrl} alt={product.name} className="w-full md:w-96 h-72 object-cover rounded-lg" />
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>
          <p className="text-3xl font-bold text-primary-600 mt-2">{formatCurrency(product.price)}</p>
          <p className={`text-sm mt-2 ${product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
            {product.stock > 0 ? `재고 ${product.stock}개` : '품절'}
          </p>
          <p className="text-gray-600 mt-4">{product.description}</p>
          <button onClick={() => { addItem(product); showToast('장바구니에 추가했습니다', 'success'); }} disabled={product.stock === 0} className="mt-6 bg-primary-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-600 transition disabled:opacity-40" data-testid="product-add-to-cart">
            {product.stock > 0 ? '장바구니 담기' : '품절'}
          </button>
        </div>
      </div>
      {recs && recs.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-bold mb-4">함께 구매한 상품</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {recs.map(r => (
              <Link key={r.productId} to={`/products/${r.productId}`} className="bg-white rounded-lg border p-3 hover:shadow-md transition">
                <img src={r.product.imageUrl} alt={r.product.name} className="w-full h-32 object-cover rounded" loading="lazy" />
                <p className="text-sm font-medium mt-2 truncate">{r.product.name}</p>
                <p className="text-sm text-primary-600 font-bold">{formatCurrency(r.product.price)}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
