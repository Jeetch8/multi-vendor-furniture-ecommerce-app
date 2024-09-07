'use client';

import ProductList from '@/components/main/products/ProductList';
import { useEffect } from 'react';
import SortBy from '@/components/main/products/SortBy';
import FilterDrawer from '@/components/main/products/FilterDrawer';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import Container from '@/components/shared/ui/Container';
import { TProductsForList, TProductsForWithOptions } from '@/types/Product';
import useFetch from 'use-http';

const sortOptions = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Most Reviews', value: 'review' },
];

function ProductsPage() {
  const searchParams = useSearchParams();

  const { data, loading, error, get } = useFetch<TProductsForWithOptions>(
    `/api/products?${searchParams.toString()}`,
    [searchParams]
  );

  const { categoriesForSidebar, availableAttributes, priceRange } = data ?? {};

  return (
    <Container className="px-6 md:px-0">
      <div>
        <div className="flex items-center justify-between py-4 bg-background">
          <SortBy options={sortOptions} />
          <FilterDrawer
            categories={categoriesForSidebar ?? []}
            attributes={availableAttributes ?? {}}
            priceRange={priceRange ?? { min: 0, max: 10000 }}
            isLoading={loading}
          />
        </div>
        <div className="w-full">
          <ProductList data={data} loading={loading} error={error} />
        </div>
      </div>
    </Container>
  );
}

export default ProductsPage;
