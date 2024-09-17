import { Suspense } from 'react';

import { Box, EmptyTableBody, Search } from '@/components/shared/ui';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import AddNewCarrierForm from '@/components/main/store/carrier/AddNewCarrierForm';
import CarrierTable from '@/components/main/store/carrier/CarrierTable';

type PageProps = {
  searchParams?: {
    search?: string;
  };
};

const carriersTableHeaders = [
  'ID',
  'Image',
  'Status',
  'Code',
  'Rate name',
  'Base Rate',
  'Per Kg Rate',
  'Min Weight',
  'Max Weight',
  '',
];

function CarriersPage({ searchParams }: PageProps) {
  return (
    <Box className="px-4 py-8">
      <div className="flex flex-col gap-3">
        <h3 className="text-2xl">Carriers</h3>
        <div className="flex justify-between">
          <div className="w-[250px]">
            <Suspense>
              <Search placeholder="Search anything" />
            </Suspense>
          </div>
          <div className="flex items-center">
            <div>
              <Dialog>
                <DialogTrigger className="ml-2 rounded-xl bg-secondary px-4 py-2 text-primary active:bg-primary-foreground duration-200">
                  Add new carrier
                </DialogTrigger>
                <DialogContent
                  className="max-h-[80vh] max-w-[60rem] overflow-y-auto"
                  aria-describedby="create-carrier-description"
                >
                  <DialogTitle>New Carrier Form</DialogTitle>
                  <div className="max-w-full">
                    <AddNewCarrierForm />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
        <Separator />

        <Suspense
          key={searchParams?.search}
          fallback={
            <EmptyTableBody
              cols={10}
              rows={12}
              tableHeaders={carriersTableHeaders}
            />
          }
        >
          <CarrierTable />
        </Suspense>
      </div>
    </Box>
  );
}

export default CarriersPage;
