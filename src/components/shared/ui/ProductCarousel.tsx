import ProductCard from '@/components/shared/ui/ProductCard';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { TProduct, TProductImage } from '@/lib/schema';

export type ProductCarouselProps = {
  products: (TProduct & {
    images: TProductImage[];
  })[];
};

async function ProductCarousel({ products }: ProductCarouselProps) {
  return (
    <Carousel className="w-full">
      <CarouselContent className="grid h-[500px] w-full auto-cols-[400px] grid-flow-col gap-2 p-4">
        {products?.map((product) => (
          <CarouselItem key={product.id} className="h-full w-full">
            <ProductCard product={product} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="absolute -top-4 right-12 flex">
        <CarouselPrevious className="-left-6 border-[2px] border-border bg-background text-foreground shadow-sm hover:bg-background hover:text-foreground" />
        <CarouselNext className="border-[2px] border-border bg-background text-foreground shadow-sm hover:bg-background hover:text-foreground" />
      </div>
    </Carousel>
  );
}
export default ProductCarousel;
