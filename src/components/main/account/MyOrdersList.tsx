import { fetchOrdersByUser } from '@/lib/services/order';
import OrderItem from './OrderItem';
import { auth } from '@/lib/auth';

async function MyOrdersList() {
  const session = await auth();
  const user = session?.user;

  const orders = await fetchOrdersByUser(user?.id as string);

  return (
    <section className="flex flex-col gap-6">
      {orders.map((order, index) => (
        <>
          <OrderItem key={order.id} order={order} />
        </>
      ))}
    </section>
  );
}

export default MyOrdersList;
