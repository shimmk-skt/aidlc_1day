export default function EmptyState({ icon = '📭', message, actionLabel, onAction }: { icon?: string; message: string; actionLabel?: string; onAction?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-500">
      <span className="text-5xl mb-4">{icon}</span>
      <p className="text-lg mb-4">{message}</p>
      {actionLabel && onAction && <button onClick={onAction} className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition" data-testid="empty-state-action">{actionLabel}</button>}
    </div>
  );
}
