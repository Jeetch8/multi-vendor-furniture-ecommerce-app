import CartTable from '@/components/main/cart/CartTable';
import TotalPrice from '@/components/main/cart/TotalPrice';
import { Separator } from '@/components/ui/separator';

async function CartPage() {
  return (
    <div>
      <div className="flex flex-col gap-6">
        <CartTable />
        <Separator />
        <TotalPrice />
      </div>
    </div>
  );
}

export default CartPage;
