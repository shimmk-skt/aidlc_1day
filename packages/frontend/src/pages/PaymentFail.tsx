import { Link } from 'react-router-dom';

export default function PaymentFail() {
  return (
    <div className="text-center py-16">
      <span className="text-6xl">❌</span>
      <h1 className="text-2xl font-bold mt-4 mb-2">결제에 실패했습니다</h1>
      <p className="text-gray-600 mb-6">다시 시도해 주세요.</p>
      <Link to="/cart" className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition" data-testid="payment-fail-retry">장바구니로 돌아가기</Link>
    </div>
  );
}
