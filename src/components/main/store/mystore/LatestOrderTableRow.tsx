import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { TableCell, TableRow } from '@/components/ui/table';
import { orderStatusColors } from '@/lib/constants';
import {
  capitalizeOnlyFirstLetter,
  formatDate,
  formatDateSecondary,
} from '@/utils/helpers';
import { TOrderWithDetails } from '@/types';
import { orderStatusEnum } from '@/lib/schema';

function LatestOrderTableRow({ order }: { order: TOrderWithDetails['order'] }) {
  const products = order.orderItems.flatMap((item) => ({
    product: item.product,
    quantity: item.quantity,
    price: item.price,
  }));

  return (
    <TableRow className="font-medium">
      <TableCell className="font-semibold">
        {products?.map((item, index) => (
          <HoverCard key={index} openDelay={200}>
            <HoverCardTrigger className="flex justify-between">
              <p>{item.product.name}</p>
              <p className="font-light">x {item.quantity}</p>
            </HoverCardTrigger>
            <HoverCardContent className="w-auto font-medium text-gray-400">
              <p>Price: {item.price}</p>
            </HoverCardContent>
          </HoverCard>
        ))}
      </TableCell>

      <TableCell className="font-medium text-gray-400">
        {order.user.name}
      </TableCell>
      <TableCell className="text-xs font-semibold text-gray-400">
        <HoverCard openDelay={200}>
          <HoverCardTrigger className="text-xs font-semibold text-gray-400">
            {formatDate(order.createdAt!)}
          </HoverCardTrigger>
          <HoverCardContent className="w-[100%] text-gray-400">
            {formatDateSecondary(order.createdAt!)}
          </HoverCardContent>
        </HoverCard>
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
    </TableRow>
  );
}

export default LatestOrderTableRow;
