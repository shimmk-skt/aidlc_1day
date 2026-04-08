import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { confirmPayment } from '../api/payments';
import { useCart } from '../context/CartContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const { clearCart } = useCart();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const paymentKey = params.get('paymentKey');
    const orderId = Number(params.get('orderId'));
    const amount = Number(params.get('amount'));
    if (!paymentKey || !orderId) { setStatus('error'); return; }
    confirmPayment(paymentKey, orderId, amount).then(() => { clearCart(); setStatus('success'); }).catch(() => setStatus('error'));
  }, [params, clearCart]);

  if (status === 'loading') return <div className="flex justify-center p-12"><LoadingSpinner /></div>;
  if (status === 'error') return <div className="text-center py-16"><p className="text-red-600 text-lg mb-4">결제 확인에 실패했습니다</p><Link to="/orders" className="text-primary-500">주문 내역 확인</Link></div>;

  return (
    <div className="text-center py-16">
      <span className="text-6xl">✅</span>
      <h1 className="text-2xl font-bold mt-4 mb-2">결제가 완료되었습니다</h1>
      <p className="text-gray-600 mb-6">주문이 정상적으로 접수되었습니다.</p>
      <Link to="/orders" className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition" data-testid="payment-success-orders">주문 내역 보기</Link>
    </div>
  );
}
