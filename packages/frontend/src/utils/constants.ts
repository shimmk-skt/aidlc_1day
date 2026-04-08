import type { OrderStatus } from '../types/order';

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: '결제 대기', CONFIRMED: '주문 확인', PROCESSING: '처리 중', PICKED: '피킹 완료',
  PACKED: '포장 완료', SHIPPED: '배송 중', DELIVERED: '배송 완료', CANCELLED: '취소됨',
  ON_HOLD: '보류', BACKORDERED: '백오더', RETURN_INITIATED: '반품 접수',
  RETURN_RECEIVED: '반품 수신', REFUNDED: '환불 완료', EXCHANGED: '교환 완료',
};

export const ORDER_STATUS_COLOR: Record<OrderStatus, string> = {
  PENDING: 'bg-gray-100 text-gray-700', CONFIRMED: 'bg-blue-100 text-blue-700',
  PROCESSING: 'bg-blue-100 text-blue-700', PICKED: 'bg-blue-100 text-blue-700',
  PACKED: 'bg-blue-100 text-blue-700', SHIPPED: 'bg-purple-100 text-purple-700',
  DELIVERED: 'bg-green-100 text-green-700', CANCELLED: 'bg-red-100 text-red-700',
  ON_HOLD: 'bg-yellow-100 text-yellow-700', BACKORDERED: 'bg-orange-100 text-orange-700',
  RETURN_INITIATED: 'bg-yellow-100 text-yellow-700', RETURN_RECEIVED: 'bg-yellow-100 text-yellow-700',
  REFUNDED: 'bg-green-100 text-green-700', EXCHANGED: 'bg-green-100 text-green-700',
};

export const RETURN_REASON_LABEL: Record<string, string> = {
  DEFECTIVE: '불량', WRONG_ITEM: '오배송', CHANGE_OF_MIND: '단순 변심', DAMAGED: '파손', OTHER: '기타',
};
