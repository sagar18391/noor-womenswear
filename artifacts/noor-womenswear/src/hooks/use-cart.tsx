import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Product } from '@workspace/api-client-react';

export interface CartItem {
  product: Product;
  size: string;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  total: number;
  addItem: (product: Product, size: string, quantity?: number) => void;
  updateQuantity: (productId: number, size: string, quantity: number) => void;
  removeItem: (productId: number, size: string) => void;
  clearCart: () => void;
}

const STORAGE_KEY = 'noor-cart';
const CartContext = createContext<CartContextValue | null>(null);

function loadCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo<CartContextValue>(() => ({
    items,
    count: items.reduce((sum, item) => sum + item.quantity, 0),
    total: items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    addItem: (product, size, quantity = 1) => {
      setItems((current) => {
        const match = current.find((item) => item.product.id === product.id && item.size === size);
        if (match) {
          return current.map((item) => item === match ? { ...item, quantity: item.quantity + quantity } : item);
        }
        return [...current, { product, size, quantity }];
      });
    },
    updateQuantity: (productId, size, quantity) => {
      setItems((current) => quantity < 1
        ? current.filter((item) => !(item.product.id === productId && item.size === size))
        : current.map((item) => item.product.id === productId && item.size === size ? { ...item, quantity } : item));
    },
    removeItem: (productId, size) => {
      setItems((current) => current.filter((item) => !(item.product.id === productId && item.size === size)));
    },
    clearCart: () => setItems([]),
  }), [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside CartProvider');
  return context;
}