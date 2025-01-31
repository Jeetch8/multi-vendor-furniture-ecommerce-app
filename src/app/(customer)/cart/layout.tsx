import PathBasedPageTitle from '@/components/main/cart/PathBasedPageTitle';
import Container from '@/components/shared/ui/Container';
import { CartProvider } from '@/Context/CartContext';
import { fetchCartByUser } from '@/lib/services/cart';
import { TCartWithDetails } from '@/types/Cart';
import { auth } from '@/lib/auth';

async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const user = session?.user;

  let cart: TCartWithDetails | null = null;
  if (user && user.id) {
    cart = await fetchCartByUser(user?.id);
  }

  if (!cart) {
    return <p className="text-center">Your cart is empty</p>;
  }

  return (
    <Container className="flex flex-col gap-8 pb-16">
      <CartProvider initialCart={cart}>
        <div className="flex w-full items-center justify-center py-6">
          <PathBasedPageTitle />
        </div>
        {!cart ? <p>Your cart is empty</p> : children}
      </CartProvider>
    </Container>
  );
}

export default Layout;
