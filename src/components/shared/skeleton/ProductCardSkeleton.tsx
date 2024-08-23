import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { memo } from 'react';

interface ProductCardSkeletonProps {
  className?: string;
}

const ProductCardSkeleton = memo(({ className }: ProductCardSkeletonProps) => {
  return (
    <div className={cn('group h-full w-full', className)}>
      <div className="relative aspect-square">
        <Skeleton className="w-full h-full" />
      </div>

      <div className="mt-2">
        <Skeleton className="h-5 w-[250px] mb-2" />
        <Skeleton className="h-4 w-[100px]" />
        <Skeleton className="h-6 w-[100px] mt-3" />
      </div>
    </div>
  );
});

export default ProductCardSkeleton;
