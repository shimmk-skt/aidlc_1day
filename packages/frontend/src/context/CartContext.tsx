import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import type { Product } from '../types/product';

export interface CartItem { product: Product; quantity: number; }

interface CartState { items: CartItem[]; }
type CartAction =
  | { type: 'ADD'; product: Product; quantity: number }
  | { type: 'REMOVE'; productId: number }
  | { type: 'UPDATE_QTY'; productId: number; quantity: number }
  | { type: 'CLEAR' };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD': {
      const existing = state.items.find(i => i.product.id === action.product.id);
      if (existing) return { items: state.items.map(i => i.product.id === action.product.id ? { ...i, quantity: Math.min(i.quantity + action.quantity, 99) } : i) };
      return { items: [...state.items, { product: action.product, quantity: action.quantity }] };
    }
    case 'REMOVE': return { items: state.items.filter(i => i.product.id !== action.productId) };
    case 'UPDATE_QTY': return { items: state.items.map(i => i.product.id === action.productId ? { ...i, quantity: Math.max(1, Math.min(action.quantity, 99)) } : i) };
    case 'CLEAR': return { items: [] };
  }
}

interface CartContextType extends CartState {
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  totalAmount: number;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function loadCart(): CartState {
  try { return JSON.parse(localStorage.getItem('cart') || '{"items":[]}'); } catch { return { items: [] }; }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, loadCart);

  useEffect(() => { localStorage.setItem('cart', JSON.stringify(state)); }, [state]);

  const totalAmount = state.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{
      ...state, totalAmount, totalItems,
      addItem: (product, quantity = 1) => dispatch({ type: 'ADD', product, quantity }),
      removeItem: (productId) => dispatch({ type: 'REMOVE', productId }),
      updateQuantity: (productId, quantity) => dispatch({ type: 'UPDATE_QTY', productId, quantity }),
      clearCart: () => dispatch({ type: 'CLEAR' }),
    }}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
