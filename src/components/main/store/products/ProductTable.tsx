import { Table, TableBody, TableHeader, TableRow } from '@/components/ui/table';
import { ITEMS_PER_PAGE } from '@/lib/constants';
import { fetchProductsByStoreId } from '@/lib/services/product';
import { TSortableProductFields } from '@/types';
import { CustomTableHead } from '@/components/shared/ui';
import CustomPagination from '@/components/shared/ui/Pagination';
import { Separator } from '@/components/ui/separator';
import ProductTableRow from './ProductTableRow';
import { Suspense } from 'react';
import { auth } from '@/lib/auth';

const productTableHeads = [
  { value: 'id', label: 'ID' },
  { value: 'image', label: 'Image' },
  { value: 'status', label: 'Status', sortable: true },
  { value: 'stock', label: 'Stock', sortable: true },
  { value: 'name', label: 'Name', sortable: true },
  { value: 'category', label: 'Category', sortable: false },
  { value: 'rating', label: 'Rating' },
  { value: 'price', label: 'Price', sortable: true },
  { value: 'brand', label: 'Brand', sortable: true },
  { value: 'created_at', label: 'Created', sortable: true },
  { value: 'updated_at', label: 'Updated', sortable: true },
  { value: ' ', label: ' ' },
];

type StoreProductTableProps = {
  searchParams?: {
    search?: string;
    page?: string;
    sort: TSortableProductFields;
    order: 'asc' | 'desc';
  };
};

async function ProductTable({ searchParams }: StoreProductTableProps) {
  const session = await auth();
  const store = session?.user.store;

  const sortBy = {
    sort: searchParams?.sort || '',
    order: searchParams?.order || 'asc',
  };
  const query = searchParams?.search || '';
  const currentPage = Number(searchParams?.page) || 1;

  const res =
    (await fetchProductsByStoreId({
      storeId: store?.id || '',
      sortBy,
      currentPage,
      itemsPerPage: ITEMS_PER_PAGE,
      querySearch: query,
      includeUnapprovedStores: true,
    })) || [];

  const { countOfProducts, products } = res;

  const totalPages = Math.ceil(countOfProducts! / ITEMS_PER_PAGE); // TODO: fix

  return (
    <div>
      <Table className="overflow-hidden">
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
          {products?.map((product, index) => (
            <ProductTableRow key={product.id} product={product} index={index} />
          ))}
        </TableBody>
      </Table>
      <Separator />
      <Suspense>
        <CustomPagination
          totalPages={totalPages}
          countOfProducts={countOfProducts}
        />
      </Suspense>
    </div>
  );
}

export default ProductTable;
