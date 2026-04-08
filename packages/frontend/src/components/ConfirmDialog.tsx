export default function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel }: { isOpen: boolean; title: string; message: string; onConfirm: () => void; onCancel: () => void }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" role="alertdialog" aria-labelledby="confirm-title" aria-describedby="confirm-msg">
      <div className="bg-white rounded-xl p-6 shadow-2xl max-w-sm w-full mx-4">
        <h3 id="confirm-title" className="text-lg font-bold mb-2">{title}</h3>
        <p id="confirm-msg" className="text-gray-600 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition" data-testid="confirm-cancel">취소</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition" data-testid="confirm-ok">확인</button>
        </div>
      </div>
    </div>
  );
}
