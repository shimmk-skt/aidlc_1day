import { ORDER_STATUS_LABEL, ORDER_STATUS_COLOR } from '../utils/constants';
import { formatDateTime } from '../utils/format';
import type { StatusHistoryEntry, OrderStatus } from '../types/order';

const MAIN_STEPS: OrderStatus[] = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

export default function OrderTimeline({ history, currentStatus }: { history: StatusHistoryEntry[]; currentStatus: OrderStatus }) {
  const currentIdx = MAIN_STEPS.indexOf(currentStatus);

  return (
    <>
      {/* 데스크톱: 수평 */}
      <div className="hidden lg:flex items-center justify-between" role="list" aria-label="주문 상태 타임라인">
        {MAIN_STEPS.map((step, i) => {
          const entry = history.find(h => h.status === step);
          const isActive = i <= currentIdx;
          return (
            <div key={step} className="flex-1 flex flex-col items-center relative" role="listitem">
              {i > 0 && <div className={`absolute top-4 -left-1/2 w-full h-0.5 ${i <= currentIdx ? 'bg-primary-500' : 'bg-gray-200'}`} />}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold z-10 ${isActive ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-500'}`}>{i + 1}</div>
              <span className={`text-xs mt-1 font-medium ${isActive ? 'text-primary-600' : 'text-gray-400'}`}>{ORDER_STATUS_LABEL[step]}</span>
              {entry && <span className="text-[10px] text-gray-400">{formatDateTime(entry.timestamp)}</span>}
            </div>
          );
        })}
      </div>
      {/* 모바일: 수직 */}
      <div className="lg:hidden flex flex-col gap-3" role="list" aria-label="주문 상태 타임라인">
        {MAIN_STEPS.map((step, i) => {
          const entry = history.find(h => h.status === step);
          const isActive = i <= currentIdx;
          return (
            <div key={step} className="flex items-start gap-3" role="listitem">
              <div className="flex flex-col items-center">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isActive ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-500'}`}>{i + 1}</div>
                {i < MAIN_STEPS.length - 1 && <div className={`w-0.5 h-8 ${i < currentIdx ? 'bg-primary-500' : 'bg-gray-200'}`} />}
              </div>
              <div>
                <span className={`text-sm font-medium ${isActive ? 'text-gray-800' : 'text-gray-400'}`}>{ORDER_STATUS_LABEL[step]}</span>
                {entry && <p className="text-xs text-gray-400">{formatDateTime(entry.timestamp)}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
