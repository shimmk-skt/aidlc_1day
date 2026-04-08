import { ORDER_STATUS_LABEL, ORDER_STATUS_COLOR } from '../utils/constants';
import type { OrderStatus } from '../types/order';

export default function Badge({ status }: { status: OrderStatus }) {
  return <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${ORDER_STATUS_COLOR[status]}`} data-testid="order-badge">{ORDER_STATUS_LABEL[status]}</span>;
}
