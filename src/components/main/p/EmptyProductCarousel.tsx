import ProductCardSkeleton from '@/components/shared/skeleton/ProductCardSkeleton';
function EmptyProductCarousel({ length }: { length: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-4">
      {Array.from({ length }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}

export default EmptyProductCarousel;
