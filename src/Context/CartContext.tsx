'use client';

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from 'react';
import { calculatePriceWithDiscounts } from '@/utils/helpers';
import { TCartWithDetails } from '@/types/Cart';

type CartContextType = {
  updateCartValues: (cart: TCartWithDetails) => void;
  cart: TCartWithDetails | undefined;
  updateCart: (newCart: TCartWithDetails | null) => void;
  subTotal: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

type CartProviderProps = {
  children: ReactNode;
  initialCart?: TCartWithDetails | undefined;
};

export const CartProvider: React.FC<CartProviderProps> = ({
  children,
  initialCart,
}) => {
  const [cart, setCart] = useState<TCartWithDetails | undefined>(initialCart);
  const [subTotal, setSubTotal] = useState<number>(0);

  useEffect(() => {
    if (initialCart) {
      setCart(initialCart);
      updateCartValues(initialCart);
    }
  }, [initialCart]);

  const updateCart = useCallback((newCart: TCartWithDetails | null) => {
    setCart(newCart || undefined);
    if (newCart) {
      updateCartValues(newCart);
    }
  }, []);

  const updateCartValues = useCallback((currentCart: TCartWithDetails) => {
    const newSubTotal = currentCart.cartItems.reduce((total, item) => {
      const { finalPrice } = calculatePriceWithDiscounts(
        item.product,
        item.quantity
      );
      return total + finalPrice;
    }, 0);

    setSubTotal(newSubTotal);
  }, []);

  const value: CartContextType = {
    updateCartValues,
    cart,
    updateCart,
    subTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCartContext = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
};
