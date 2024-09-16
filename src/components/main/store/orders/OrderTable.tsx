import { Separator } from '@/components/ui/separator';
import { ITEMS_PER_PAGE } from '@/lib/constants';
import {
  fetchOrdersByStoreId,
  fetchOrdersForOrdersTable,
} from '@/lib/services/order';
import { SortableProductFields } from '@/types';
import { CustomTableHead, Pagination } from '@/components/shared/ui';
import { Table, TableBody, TableHeader, TableRow } from '@/components/ui/table';
import OrderTableRow from './OrderTableRow';
import { Suspense } from 'react';
import { auth } from '@/lib/auth';
import { orderStatusEnum, shipmentStatusEnum } from '@/lib/schema';

const productTableHeads = [
  { value: 'id', label: 'ID' },
  { value: 'order_no', label: 'Order No' },
  { value: 'orderItems', label: 'Ordered Items' },
  { value: 'user_id', label: 'Customer', sortable: true },
  { value: 'delivery_status', label: 'Delivery Status', sortable: true },
  { value: 'order_status', label: 'Order Status', sortable: true },
  { value: 'total_price', label: 'Price', sortable: true },
  { value: 'created_at', label: 'Created', sortable: true },
  { value: 'updated_at', label: 'Updated', sortable: true },
];

type StoreProductTableProps = {
  searchParams?: {
    search?: string;
    page?: string;
    sort: SortableProductFields;
    order: 'asc' | 'desc';
    orderStatus: string | string[];
    deliveryStatus: string | string[];
  };
};

async function OrderTable({ searchParams }: StoreProductTableProps) {
  const session = await auth();
  const store = session?.user.store;

  // sort
  const sortBy = {
    sort: searchParams?.sort || '',
    order: searchParams?.order || 'asc',
  };

  // search
  const query = searchParams?.search || '';

  // filter
  const filterByOrder = (typeof searchParams?.orderStatus === 'string'
    ? [searchParams?.orderStatus]
    : searchParams?.orderStatus || []
  ).filter((status: unknown): status is orderStatusEnum =>
    Object.values(orderStatusEnum).includes(status as orderStatusEnum)
  ) as unknown as orderStatusEnum[];

  const filterByShipment = (Array.isArray(searchParams?.deliveryStatus)
    ? searchParams.deliveryStatus
    : searchParams?.deliveryStatus
    ? [searchParams.deliveryStatus]
    : []
  ).filter((status: unknown): status is shipmentStatusEnum =>
    Object.values(shipmentStatusEnum).includes(status as shipmentStatusEnum)
  ) as unknown as shipmentStatusEnum[];

  const currentPage = Number(searchParams?.page) || 1;

  const { orders, totalCount } = await fetchOrdersForOrdersTable({
    storeId: store?.id || '',
    sortBy,
    currentPage,
    itemsPerPage: ITEMS_PER_PAGE,
    querySearch: query,
    filter: { filterByOrder, filterByShipment },
  });

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  if (sortBy.sort === 'total_price') {
    orders.sort((a, b) => {
      return sortBy.order === 'asc'
        ? parseFloat(a.order.totalPrice) - parseFloat(b.order.totalPrice)
        : parseFloat(b.order.totalPrice) - parseFloat(a.order.totalPrice);
    });
  }

  return (
    <div>
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow className="border-none">
            {productTableHeads.map((head, index) => (
              <Suspense key={index}>
                <CustomTableHead tableHead={head} />
              </Suspense>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders?.map((order, index) => (
            <OrderTableRow key={order.id} orderToStores={order} index={index} />
          ))}
        </TableBody>
      </Table>
      <Separator />

      <Suspense>
        <Pagination totalPages={totalPages} countOfProducts={totalCount} />
      </Suspense>
    </div>
  );
}

export default OrderTable;
