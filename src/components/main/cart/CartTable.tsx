import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { fetchCartByUser } from '@/lib/services/cart';
import { TCartWithDetails } from '@/types/Cart';
import CartTableRow from './CartTableRow';
import { auth } from '@/lib/auth';

async function CartTable() {
  const session = await auth();
  const user = session?.user;

  let cart: TCartWithDetails | null;
  if (user && user.id) {
    cart = await fetchCartByUser(user?.id);
  } else {
    return <p>Your cart is empty</p>;
  }

  if ((cart && cart?.cartItems.length === 0) || !cart) {
    return <p>Your cart is empty</p>;
  }

  return (
    <div>
      {cart?.cartItems.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[10%]">Product</TableHead>
              <TableHead className="w-[45%]"></TableHead>
              <TableHead className="w-[15%]">Price</TableHead>
              <TableHead className="w-[15%]">Pcs</TableHead>
              <TableHead className="w-[10%]">Total</TableHead>
              <TableHead className="w-[5%]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cart.cartItems.map((item) => (
              <CartTableRow key={item.id} item={item} />
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export default CartTable;
