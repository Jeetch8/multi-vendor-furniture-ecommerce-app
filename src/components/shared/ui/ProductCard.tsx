'use client';

import { TProduct, TProductImage } from '@/lib/schema';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { memo } from 'react';
import { TProductCard } from '@/types/Product';

interface ProductCardProps {
  product: TProductCard;
  className?: string;
  imgClass?: string;
}

const ProductCard = memo(
  ({ product, className, imgClass }: ProductCardProps) => {
    return (
      <div className={cn('group h-full w-full duration-300', className)}>
        <div className="relative aspect-square">
          <Carousel className="w-full h-full">
            <CarouselContent>
              {product?.images?.map((image, index) => (
                <CarouselItem key={image.id}>
                  <div className="relative aspect-square w-full">
                    <Image
                      src={image.thumbUrl ?? image.url}
                      alt={`${product.name} - Image ${index + 1}`}
                      fill
                      className={cn('object-cover', imgClass)}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={index === 0}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              <CarouselPrevious className="relative translate-y-0 left-0 h-8 w-8 bg-transparent border-none backdrop-blur-md text-accent-foreground" />
              <CarouselNext className="relative translate-y-0 right-0 h-8 w-8 bg-transparent border-none backdrop-blur-md text-accent-foreground" />
            </div>
          </Carousel>
        </div>

        <div className="flex flex-col gap-2 px-0 py-3">
          <div className="flex flex-col flex-1">
            <Link href={`/p/${product.slug}`} className="flex h-full flex-col">
              <h3 className="text-base font-medium line-clamp-2 group-hover:text-primary transition-colors">
                {product.name}
              </h3>
            </Link>
            <p className="text-sm text-muted-foreground">{product.brand}</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold">
              ${product?.price?.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.product.id === nextProps.product.id;
  }
);

export default ProductCard;
