'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCartContext } from '@/Context/CartContext';
import { LuShoppingBag } from 'react-icons/lu';
import CartProductCard from '@/components/main/NavigationBar/CartProductCard';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
  const { cart, subTotal } = useCartContext();
  const router = useRouter();

  const handleViewCart = () => {
    router.push('/cart');
    onClose();
  };
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-lg p-0">
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle className="flex items-center gap-2">
            <LuShoppingBag className="w-5 h-5" />
            <span>Shopping Cart</span>
            {cart?.cartItems && cart.cartItems.length > 0 && (
              <span className="text-sm text-muted-foreground">
                ({cart.cartItems.length})
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-12rem)] px-5">
          {cart?.cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground mt-10">
              <LuShoppingBag className="w-12 h-12 mb-2" />
              <p>Your cart is empty</p>
            </div>
          ) : (
            <div>
              {cart?.cartItems.map((item) => (
                <CartProductCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="absolute bottom-0 left-0 right-0 p-6 bg-background border-t">
          <div className="flex items-center justify-between mb-4">
            <span className="font-medium">Subtotal</span>
            <span className="font-medium">${subTotal.toFixed(2)}</span>
          </div>
          <Button
            className="w-full"
            size="lg"
            onClick={handleViewCart}
            disabled={!cart?.cartItems.length}
          >
            View Cart
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
