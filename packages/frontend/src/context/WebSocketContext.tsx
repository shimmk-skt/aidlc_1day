import { createContext, useContext, useEffect, useRef, useState, useCallback, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import type { WSEvent } from '../types/websocket';

interface WSContextType {
  isConnected: boolean;
  subscribe: (cb: (event: WSEvent) => void) => () => void;
}

const WebSocketContext = createContext<WSContextType | undefined>(undefined);

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const wsRef = useRef<WebSocket | null>(null);
  const listenersRef = useRef<Set<(e: WSEvent) => void>>(new Set());
  const [isConnected, setIsConnected] = useState(false);
  const retriesRef = useRef(0);

  useEffect(() => {
    if (!user) { wsRef.current?.close(); return; }

    function connect() {
      const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
      const ws = new WebSocket(`${protocol}//${location.host}/ws`);
      wsRef.current = ws;

      ws.onopen = () => { setIsConnected(true); retriesRef.current = 0; };
      ws.onclose = () => {
        setIsConnected(false);
        if (retriesRef.current < 5) {
          const delay = Math.pow(2, retriesRef.current) * 1000;
          retriesRef.current++;
          setTimeout(connect, delay);
        }
      };
      ws.onmessage = (msg) => {
        const event: WSEvent = JSON.parse(msg.data);
        listenersRef.current.forEach(cb => cb(event));
        if (event.type === 'inventory_update') { queryClient.invalidateQueries({ queryKey: ['products'] }); }
        if (event.type === 'order_update' || event.type === 'new_order') { queryClient.invalidateQueries({ queryKey: ['orders'] }); queryClient.invalidateQueries({ queryKey: ['dashboard'] }); }
      };
    }
    connect();
    return () => { wsRef.current?.close(); };
  }, [user, queryClient]);

  const subscribe = useCallback((cb: (e: WSEvent) => void) => {
    listenersRef.current.add(cb);
    return () => { listenersRef.current.delete(cb); };
  }, []);

  return <WebSocketContext.Provider value={{ isConnected, subscribe }}>{children}</WebSocketContext.Provider>;
}

export function useWebSocket() {
  const ctx = useContext(WebSocketContext);
  if (!ctx) throw new Error('useWebSocket must be used within WebSocketProvider');
  return ctx;
}
