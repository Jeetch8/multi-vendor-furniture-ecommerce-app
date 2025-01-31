import { redirect } from 'next/navigation';

import CreateOrderForm from '@/components/main/cart/CreateOrderForm';
import OrderSummary from '@/components/main/cart/OrderSummary';
import { getUniqueStoreIds } from '@/utils/helpers';
import { fetchAddressesByUser } from '@/lib/services/address';
import { fetchCartByUser } from '@/lib/services/cart';
import { getStoresByIds } from '@/lib/services/store';
import { auth } from '@/lib/auth';

async function CheckoutPage() {
  const session = await auth();
  const user = session?.user;

  if (!user || !user.id) {
    redirect('/products');
  }

  const [cart, addresses] = await Promise.all([
    fetchCartByUser(user.id),
    fetchAddressesByUser(user.id),
  ]);

  if (!cart || cart.cartItems.length < 1) {
    redirect('/products');
  }

  const uniqueStoreIds = getUniqueStoreIds(cart);
  const stores = await getStoresByIds(uniqueStoreIds);

  const carriers = stores.flatMap((store) =>
    store.storeToCarriers.map((carrier) => ({
      ...carrier,
      store_id: store.id,
    }))
  );

  const userWithDetails = {
    user,
    addresses,
    carriers,
  };

  return (
    <div className="grid grid-cols-2 gap-x-28 px-6">
      <div className="col-span-1">
        <CreateOrderForm userWithDetails={userWithDetails} />
      </div>

      <div className="col-span-1">
        <OrderSummary />
      </div>
    </div>
  );
}

export default CheckoutPage;
