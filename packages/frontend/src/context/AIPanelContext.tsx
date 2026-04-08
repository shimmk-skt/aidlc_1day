import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface AIPanelContextType {
  isOpen: boolean;
  activeTab: 'chat' | 'forecast' | 'recommendations';
  toggle: () => void;
  open: (tab?: AIPanelContextType['activeTab']) => void;
  close: () => void;
  setActiveTab: (tab: AIPanelContextType['activeTab']) => void;
}

const AIPanelContext = createContext<AIPanelContextType | undefined>(undefined);

export function AIPanelProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<AIPanelContextType['activeTab']>('chat');

  const toggle = useCallback(() => setIsOpen(p => !p), []);
  const open = useCallback((tab?: AIPanelContextType['activeTab']) => { if (tab) setActiveTab(tab); setIsOpen(true); }, []);
  const close = useCallback(() => setIsOpen(false), []);

  return <AIPanelContext.Provider value={{ isOpen, activeTab, toggle, open, close, setActiveTab }}>{children}</AIPanelContext.Provider>;
}

export function useAIPanel() {
  const ctx = useContext(AIPanelContext);
  if (!ctx) throw new Error('useAIPanel must be used within AIPanelProvider');
  return ctx;
}
