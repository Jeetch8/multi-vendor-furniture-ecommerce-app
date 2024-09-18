import { Suspense } from 'react';

import { Box, EmptyTableBody } from '@/components/shared/ui';
import DiscountTable from '@/components/main/store/discounts/DiscountTable';
import NewDiscountForm from '@/components/main/store/discounts/NewDiscountForm';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { fetchProductsByStoreId } from '@/lib/services/product';
import { auth } from '@/lib/auth';

const discountTableHeaders = [
  'ID',
  'Name',
  'Description',
  'Discount',
  'Active',
  'Category',
  'Product',
  'Start date',
  'End date',
  'Created',
  'Updated',
  '',
];

async function DiscountsPage() {
  const session = await auth();
  const store = session?.user?.store;

  const { products } = await fetchProductsByStoreId({ storeId: store?.id! });

  return (
    <Box className="px-4 py-8">
      <div className="flex flex-col gap-3">
        <h3 className="text-2xl">Discounts</h3>
        <div className="flex justify-end gap-2">
          <Dialog>
            <DialogTrigger className="rounded-xl bg-orange-1 px-4 py-2 text-white active:bg-orange-400">
              Add discount
            </DialogTrigger>
            <DialogContent
              className="max-h-[80vh] max-w-[60rem] overflow-y-auto"
              aria-describedby="create-product-description"
            >
              <DialogTitle>Create a Discount</DialogTitle>
              <div className="max-w-full">
                <NewDiscountForm products={products} />
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <Suspense
          fallback={
            <EmptyTableBody
              cols={10}
              rows={12}
              tableHeaders={discountTableHeaders}
            />
          }
        >
          <DiscountTable />
        </Suspense>
      </div>
    </Box>
  );
}

export default DiscountsPage;
