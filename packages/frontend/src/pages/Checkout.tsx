import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAddresses } from '../hooks/queries/useAddresses';
import { createOrder } from '../api/orders';
import { useToast } from '../context/ToastContext';
import { formatCurrency } from '../utils/format';
import LoadingSpinner from '../components/LoadingSpinner';

declare global { interface Window { TossPayments: any; } }

export default function Checkout() {
  const { items, totalAmount } = useCart();
  const { data: addresses, isLoading } = useAddresses();
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!selectedAddressId) { showToast('배송 주소를 선택해 주세요', 'error'); return; }
    setLoading(true);
    try {
      const order = await createOrder(items.map(i => ({ productId: i.product.id, quantity: i.quantity })), selectedAddressId);
      const tossPayments = await window.TossPayments('test_ck_placeholder');
      const payment = tossPayments.payment({ customerKey: `user_${order.userId}` });
      await payment.requestPayment({
        method: 'CARD',
        amount: { currency: 'KRW', value: totalAmount },
        orderId: `order_${order.id}`,
        orderName: `Inventrix 주문 #${order.id}`,
        successUrl: `${window.location.origin}/checkout/success?orderId=${order.id}`,
        failUrl: `${window.location.origin}/checkout/fail?orderId=${order.id}`,
      });
    } catch (err) {
      showToast(err instanceof Error ? err.message : '결제 요청에 실패했습니다', 'error');
    } finally { setLoading(false); }
  };

  if (isLoading) return <div className="flex justify-center p-12"><LoadingSpinner /></div>;
  if (!items.length) { navigate('/cart'); return null; }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">결제</h1>
      <div className="bg-white rounded-lg border p-6 mb-4">
        <h2 className="font-bold mb-3">배송 주소</h2>
        {addresses?.length ? (
          <div className="space-y-2">
            {addresses.map(a => (
              <label key={a.id} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer ${selectedAddressId === a.id ? 'border-primary-500 bg-primary-50' : ''}`}>
                <input type="radio" name="address" checked={selectedAddressId === a.id} onChange={() => setSelectedAddressId(a.id)} className="mt-1" />
                <div>
                  <p className="font-medium">{a.name} {a.isDefault && <span className="text-xs bg-primary-100 text-primary-600 px-1.5 py-0.5 rounded">기본</span>}</p>
                  <p className="text-sm text-gray-600">{a.address} {a.addressDetail}</p>
                  <p className="text-sm text-gray-500">{a.phone}</p>
                </div>
              </label>
            ))}
          </div>
        ) : <p className="text-gray-500 text-sm">저장된 주소가 없습니다. <a href="/my/addresses" className="text-primary-500">주소 추가</a></p>}
      </div>
      <div className="bg-white rounded-lg border p-6 mb-4">
        <h2 className="font-bold mb-3">주문 요약</h2>
        {items.map(i => (
          <div key={i.product.id} className="flex justify-between text-sm py-1">
            <span>{i.product.name} × {i.quantity}</span>
            <span>{formatCurrency(i.product.price * i.quantity)}</span>
          </div>
        ))}
        <div className="border-t mt-3 pt-3 flex justify-between font-bold">
          <span>합계</span><span>{formatCurrency(totalAmount)}</span>
        </div>
      </div>
      <button onClick={handleCheckout} disabled={loading || !selectedAddressId} className="w-full bg-primary-500 text-white py-3 rounded-lg font-semibold hover:bg-primary-600 transition disabled:opacity-50" data-testid="checkout-pay">{loading ? '처리 중...' : `${formatCurrency(totalAmount)} 결제하기`}</button>
    </div>
  );
}
