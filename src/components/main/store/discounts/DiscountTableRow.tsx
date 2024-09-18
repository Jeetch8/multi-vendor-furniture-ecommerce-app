'use client';

import { TableCell, TableRow } from '@/components/ui/table';
import { TDiscountForDiscountTable } from '@/types/discount';
import { formatDate } from '@/utils/helpers';

type DiscountTableRowProps = {
  discount: TDiscountForDiscountTable;
  index: number;
};

function DiscountTableRow({ discount, index }: DiscountTableRowProps) {
  return (
    <TableRow className="transition-colors">
      <TableCell>{index + 1}</TableCell>

      <TableCell className="font-medium">{discount.name}</TableCell>

      <TableCell className="text-gray-500">{discount.description}</TableCell>

      <TableCell className="font-medium">
        {discount.category?.name || ''}
      </TableCell>

      <TableCell className="font-medium">
        {discount.product?.name || ''}
      </TableCell>

      <TableCell className="font-semibold text-orange-600">
        {discount.discountPercent}%
      </TableCell>

      <TableCell>
        <span
          className={`rounded-full px-2 py-1 text-sm ${
            discount.active
              ? 'bg-green-100 text-green-600'
              : 'bg-red-100 text-red-600'
          }`}
        >
          {discount.active ? 'Active' : 'Inactive'}
        </span>
      </TableCell>

      <TableCell className="text-gray-400">
        {formatDate(discount.startDate)}
      </TableCell>

      <TableCell className="text-gray-400">
        {discount.endDate ? formatDate(discount.endDate) : 'Ongoing'}
      </TableCell>

      <TableCell className="text-gray-400">
        {formatDate(discount.createdAt!)}
      </TableCell>
    </TableRow>
  );
}

export default DiscountTableRow;
