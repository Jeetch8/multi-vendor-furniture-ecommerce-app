import {
  capitalizeOnlyFirstLetter,
  formatDate,
  formatDateSecondary,
} from '@/utils/helpers';
import { TOrderforOrdersTable, TOrderWithDetails } from '@/types';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { TableCell, TableRow } from '@/components//ui/table';
import { orderStatusColors } from '@/lib/constants';
import { ProductPriceDisplay } from '@/components/shared/ui';
import { orderStatusEnum } from '@/lib/schema';

type OrderTableRowType = {
  orderToStores: TOrderforOrdersTable;
  index: number;
};

type DeliveryStatusType =
  | 'PENDING'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'RETURNED'
  | 'FAILED';

const deliveryStatusColors: { [key: string]: string } = {
  PENDING: 'text-yellow-500',
  PROCESSING: 'text-blue-500',
  SHIPPED: 'text-indigo-500',
  IN_TRANSIT: 'text-teal-500',
  DELIVERED: 'text-green-600',
  RETURNED: 'text-red-600',
  FAILED: 'text-red-700',
};

function OrderTableRow({ orderToStores, index }: OrderTableRowType) {
  const products = orderToStores.orderItems.flatMap((i) => ({
    product: i.product,
    quantity: i.quantity,
    price: i.price,
  }));

  const address = orderToStores.shippingAddress;
  const deliveryStatus = orderToStores.shipment?.status as
    | DeliveryStatusType
    | undefined;

  const order = orderToStores.order;

  return (
    <TableRow key={order.id}>
      <TableCell>{index + 1}</TableCell>
      <TableCell className="font-medium text-gray-400">
        {order.orderNo}
      </TableCell>
      <TableCell className="font-semibold">
        {products.map((item, index) => (
          <HoverCard key={index} openDelay={200}>
            <HoverCardTrigger className="flex justify-between">
              <p>{item.product.name}</p>
              <p className="font-light">x {item.quantity}</p>
            </HoverCardTrigger>
            <HoverCardContent className="w-auto font-medium text-gray-400">
              <p>Price: {Number(item.price)}</p>
            </HoverCardContent>
          </HoverCard>
        ))}
      </TableCell>
      <TableCell>
        <HoverCard openDelay={200}>
          <HoverCardTrigger className="font-medium text-gray-400">
            {order.user.name}
          </HoverCardTrigger>
          <HoverCardContent className="flex w-[100%] flex-col gap-1 text-start">
            <p>Name: {order.user.name}</p>
            <p>Email: {order.user.email}</p>
            <p>Phone: {address.phoneNumber}</p>
            <p>Address Title: {address.title}</p>
            <p>Address 1: {address.addressLine1}</p>
            <p>Address 2: {address.addressLine2}</p>
            <p>Postal Code: {address.postalCode}</p>
            <p>City: {address.city}</p>
            <p>Landmark: {address.landmark}</p>
            <p>Country: {address.country}</p>
          </HoverCardContent>
        </HoverCard>
      </TableCell>

      <TableCell
        className={` ${
          deliveryStatusColors[deliveryStatus || 'PENDING']
        } font-semibold`}
      >
        {capitalizeOnlyFirstLetter(deliveryStatus || '')}
      </TableCell>
      <TableCell>
        <div
          className={`inline-block rounded-3xl border px-[7px] py-[4px] ${
            orderStatusColors[order.orderStatus as orderStatusEnum]
          } text-xs font-semibold`}
        >
          {capitalizeOnlyFirstLetter(order.orderStatus!)}
        </div>
      </TableCell>
      <TableCell className="font-semibold text-orange-1">
        ${order.totalPrice}
      </TableCell>

      <TableCell className="text-gray-400">
        <HoverCard openDelay={200}>
          <HoverCardTrigger className="text-gray-400">
            {formatDate(order.createdAt!)}
          </HoverCardTrigger>
          <HoverCardContent className="w-[100%]">
            {formatDateSecondary(order.createdAt!)}
          </HoverCardContent>
        </HoverCard>
      </TableCell>
      <TableCell className="text-gray-400">
        <HoverCard openDelay={200}>
          <HoverCardTrigger className="text-gray-400">
            {formatDate(order.updatedAt!)}
          </HoverCardTrigger>
          <HoverCardContent className="w-[100%]">
            {formatDateSecondary(order.updatedAt!)}
          </HoverCardContent>
        </HoverCard>
      </TableCell>
    </TableRow>
  );
}

export default OrderTableRow;
