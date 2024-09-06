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
  title?: string;
  products: (TProduct & {
    images: TProductImage[];
  })[];
};

async function ProductCarousel({ products, title }: ProductCarouselProps) {
  return (
    <Carousel className="w-full">
      {title && <h3 className="text-2xl font-bold text-gray-800">{title}</h3>}
      <div className="absolute -top-4 right-12 flex">
        <CarouselPrevious className="-left-6 border-[2px] border-border bg-background text-foreground shadow-sm hover:bg-background hover:text-foreground" />
        <CarouselNext className="border-[2px] border-border bg-background text-foreground shadow-sm hover:bg-background hover:text-foreground" />
      </div>
      <CarouselContent className="grid h-[500px] w-full auto-cols-[400px] grid-flow-col gap-2 p-4">
        {products?.map((product) => (
          <CarouselItem key={product.id} className="h-full w-full">
            <ProductCard product={product} />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
export default ProductCarousel;
