import { useToast } from '../context/ToastContext';

const COLORS = { success: 'bg-green-500', error: 'bg-red-500', info: 'bg-blue-500' };

export default function Toast() {
  const { toasts, dismissToast } = useToast();
  if (!toasts.length) return null;
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2" aria-live="polite" aria-atomic="true">
      {toasts.map(t => (
        <div key={t.id} className={`${COLORS[t.type]} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[280px] animate-slide-in`} role="alert">
          <span className="flex-1 text-sm">{t.message}</span>
          <button onClick={() => dismissToast(t.id)} className="text-white/80 hover:text-white" aria-label="닫기">✕</button>
        </div>
      ))}
    </div>
  );
}
