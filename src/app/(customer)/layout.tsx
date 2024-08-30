import React from 'react';
import Navbar from '@/components/shared/ui/Navbar';
import SessionProvider from '@/components/Providers/SessionProvider';
import { CartProvider } from '@/Context/CartContext';
import { auth } from '@/lib/auth';
import { fetchCartByUser } from '@/lib/services/cart';
import { TCartWithDetails } from '@/types/Cart';

const layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();
  const user = session?.user;

  let cart: TCartWithDetails | null = null;
  if (user && user.id) {
    cart = await fetchCartByUser(user?.id);
  }

  return (
    <CartProvider initialCart={cart ?? undefined}>
      <Navbar />
      {children}
    </CartProvider>
  );
};

export default layout;
