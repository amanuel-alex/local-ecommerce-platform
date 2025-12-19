'use client';

import { ReactNode } from 'react';
import { CartProvider as ShoppingCartProvider } from '@/contexts/cart-context';

export function CartProvider({ children }: { children: ReactNode }) {
  return <ShoppingCartProvider>{children}</ShoppingCartProvider>;
}
