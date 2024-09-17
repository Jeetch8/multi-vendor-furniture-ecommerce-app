import { TableCell, TableRow } from '@/components/ui/table';
import { formatDate } from '@/utils/helpers';
import { TStoreToCarrierForTable } from '@/types';

type CarrierTableRowProps = {
  storeCarrier: TStoreToCarrierForTable;
  index: number;
};

function CarrierTableRow({ storeCarrier, index }: CarrierTableRowProps) {
  const { carrier } = storeCarrier;

  return (
    <TableRow>
      <TableCell>{index + 1}</TableCell>
      <TableCell>
        {' '}
        <span
          className={`inline-flex cursor-pointer items-center rounded-full px-2 py-0.5 text-xs font-medium ${
            carrier.isActive
              ? 'bg-green-100 text-green-600'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {carrier.isActive ? 'Active' : 'Inactive'}
        </span>
      </TableCell>
      <TableCell className="font-semibold">{carrier.code}</TableCell>
      <TableCell className="font-medium text-orange-1">
        {carrier.shippingRates[0].baseRate}$
      </TableCell>
      <TableCell className="font-medium text-orange-1">
        {carrier.shippingRates[0].perKgRate}$
      </TableCell>
      <TableCell>{carrier.shippingRates[0].maxWeight}kg</TableCell>
      <TableCell>{carrier.shippingRates[0].maxWeight}kg</TableCell>
      <TableCell className="soft-text">
        {formatDate(carrier.createdAt!)}
      </TableCell>
      <TableCell className="soft-text">
        {formatDate(carrier.createdAt!)}
      </TableCell>
      <TableCell></TableCell>
    </TableRow>
  );
}

export default CarrierTableRow;
