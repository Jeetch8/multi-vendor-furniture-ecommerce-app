import { Suspense } from 'react';

import { CustomTableHead } from '@/components/shared/ui';
import { TableHeader, TableRow, TableBody, Table } from '@/components/ui/table';
import CarrierTableRow from './CarrierTableRow';
import { fetchCarriersByStore } from '@/lib/services/carrier';
import { auth } from '@/lib/auth';
import { Separator } from '@/components/ui/separator';

const carriersTableHeaders = [
  { value: 'id', label: 'ID' },
  { value: 'status', label: 'Status' },
  { value: 'code', label: 'Code' },
  { value: 'rate_name', label: 'Rate Name' },
  { value: 'per_kg_rate', label: 'Price per kg' },
  { value: 'min_weight', label: 'Min Weight' },
  { value: 'max_weight', label: 'Max Weight' },
  { value: 'created_at', label: 'Created', sortable: true },
  { value: 'updated_at', label: 'Updated', sortable: true },
  { value: ' ', label: ' ' },
];

async function CarrierTable() {
  const session = await auth();
  const store = session?.user?.store;
  const storeCarriers = await fetchCarriersByStore(store?.id as string);

  return (
    <div>
      <Table className="overflow-hidden">
        <TableHeader className="bg-gray-50">
          <TableRow className="border-none">
            {carriersTableHeaders.map((head, index) => (
              <Suspense key={index}>
                <CustomTableHead tableHead={head} />
              </Suspense>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {storeCarriers?.map((carrier, index) => (
            <CarrierTableRow
              key={`${carrier.carrierId}-${carrier.storeId}`}
              storeCarrier={carrier}
              index={index}
            />
          ))}
        </TableBody>
      </Table>
      <Separator />
    </div>
  );
}

export default CarrierTable;
