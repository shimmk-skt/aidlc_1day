import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/format';
import EmptyState from '../components/EmptyState';

export default function Cart() {
  const { items, totalAmount, updateQuantity, removeItem } = useCart();

  if (!items.length) return <EmptyState icon="🛒" message="장바구니가 비어있습니다" actionLabel="쇼핑하러 가기" onAction={() => window.location.href = '/'} />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">장바구니</h1>
      <div className="space-y-4">
        {items.map(item => (
          <div key={item.product.id} className="bg-white rounded-lg border p-4 flex items-center gap-4" data-testid={`cart-item-${item.product.id}`}>
            <img src={item.product.imageUrl} alt={item.product.name} className="w-20 h-20 object-cover rounded" />
            <div className="flex-1">
              <Link to={`/products/${item.product.id}`} className="font-medium hover:text-primary-500">{item.product.name}</Link>
              <p className="text-primary-600 font-bold">{formatCurrency(item.product.price)}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="w-8 h-8 border rounded flex items-center justify-center" aria-label="수량 감소">−</button>
              <span className="w-8 text-center" data-testid={`cart-qty-${item.product.id}`}>{item.quantity}</span>
              <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-8 h-8 border rounded flex items-center justify-center" aria-label="수량 증가">+</button>
            </div>
            <p className="font-bold w-24 text-right">{formatCurrency(item.product.price * item.quantity)}</p>
            <button onClick={() => removeItem(item.product.id)} className="text-red-400 hover:text-red-600" aria-label="삭제" data-testid={`cart-remove-${item.product.id}`}>✕</button>
          </div>
        ))}
      </div>
      <div className="mt-6 bg-white rounded-lg border p-6 flex items-center justify-between">
        <span className="text-lg font-bold">합계: {formatCurrency(totalAmount)}</span>
        <Link to="/checkout" className="bg-primary-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-600 transition" data-testid="cart-checkout">결제하기</Link>
      </div>
    </div>
  );
}
