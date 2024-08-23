import ProductCardSkeleton from '@/components/shared/skeleton/ProductCardSkeleton';
import ProductCard from '@/components/shared/ui/ProductCard';
import ProductsPaginator from './ProductsPaginator';
import { TProductsForList } from '@/types/Product';

function ProductList({
  data,
  loading,
  error,
}: {
  data: TProductsForList | undefined;
  loading: boolean | undefined;
  error: Error | undefined;
}) {
  if (error) {
    return (
      <div className="text-center py-10 text-destructive">
        Error loading products. Please try again.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-4">
        {Array.from({ length: 12 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-4">
        {data?.productsList?.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
        {data?.productsList.length === 0 && (
          <div className="col-span-full text-center py-10">
            <p className="text-gray-500">No products found</p>
          </div>
        )}
      </div>
      {data?.pagination && (
        <ProductsPaginator
          totalItems={data.pagination.totalItems}
          itemsPerPage={data.pagination.itemsPerPage}
          currentPage={data.pagination.currentPage}
        />
      )}
    </section>
  );
}

export default ProductList;
