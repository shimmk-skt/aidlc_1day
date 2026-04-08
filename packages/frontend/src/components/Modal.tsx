import { useEffect, useRef, ReactNode } from 'react';

export default function Modal({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (isOpen) { el.showModal(); } else { el.close(); }
  }, [isOpen]);

  if (!isOpen) return null;
  return (
    <dialog ref={dialogRef} onClose={onClose} className="rounded-xl shadow-2xl p-0 backdrop:bg-black/50 max-w-lg w-full" aria-labelledby="modal-title">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 id="modal-title" className="text-lg font-bold">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl" aria-label="닫기" data-testid="modal-close">✕</button>
        </div>
        {children}
      </div>
    </dialog>
  );
}
