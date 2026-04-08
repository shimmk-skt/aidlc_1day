import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface Toast { id: number; message: string; type: 'success' | 'error' | 'info'; }

interface ToastContextType {
  toasts: Toast[];
  showToast: (message: string, type?: Toast['type']) => void;
  dismissToast: (id: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);
let nextId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = nextId++;
    setToasts(prev => [...prev, { id, message, type }]);
    if (type !== 'error') setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), type === 'info' ? 5000 : 3000);
  }, []);

  const dismissToast = useCallback((id: number) => setToasts(prev => prev.filter(t => t.id !== id)), []);

  return <ToastContext.Provider value={{ toasts, showToast, dismissToast }}>{children}</ToastContext.Provider>;
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
