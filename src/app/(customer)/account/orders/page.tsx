import MyOrdersList from '@/components/main/account/MyOrdersList';
import EmptyTableBody from '@/components/shared/ui/EmptyTableBody';
import { Suspense } from 'react';

function OrdersPage() {
  return (
    <div className="flex flex-col gap-4 py-6">
      <h3 className="text-2xl font-bold">Orders</h3>
      <Suspense fallback={<EmptyTableBody rows={4} cols={4} />}>
        <MyOrdersList />
      </Suspense>
    </div>
  );
}

export default OrdersPage;
