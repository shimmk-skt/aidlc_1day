import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { User } from '../types/auth';
import { loginApi, registerApi, logoutApi } from '../api/auth';
import { setAccessToken } from '../api/client';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
    setIsLoading(false);

    const handleLogout = () => { setUser(null); setAccessToken(null); localStorage.removeItem('user'); };
    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await loginApi(email, password);
    setUser(data.user);
    setAccessToken(data.accessToken);
    localStorage.setItem('user', JSON.stringify(data.user));
  }, []);

  const register = useCallback(async (email: string, password: string, name: string) => {
    const data = await registerApi(email, password, name);
    setUser(data.user);
    setAccessToken(data.accessToken);
    localStorage.setItem('user', JSON.stringify(data.user));
  }, []);

  const logout = useCallback(async () => {
    await logoutApi();
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem('user');
  }, []);

  return <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
