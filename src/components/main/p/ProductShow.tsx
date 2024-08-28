'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import StickyImageScroll from './StickyImageScroll';
import { teko } from '@/lib/fonts';
import ProductDetailsAccordion from './ProductDetailsAccordion';
import { TProductForShowPage } from '@/types/Product';
import ProductSelectableAttr from './ProductSelectableAttr';
import { useSession } from 'next-auth/react';
import {
  Carousel,
  CarouselItem,
  CarouselContent,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { IoMdHeart } from 'react-icons/io';
import { toggleFavorite } from '@/actions/favorites';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

type ProductProps = {
  product: TProductForShowPage;
  storeRating: number | null;
  children?: React.ReactNode;
};

function ProductShow({ product, storeRating }: ProductProps) {
  const [selectedProductAttributes, setSelectedProductAttributes] = useState<
    { attName: string; val: string }[]
  >([]);
  const session = useSession();
  const user = session?.data?.user;
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectableProductAttributes, setSelectableProductAttributes] =
    useState<
      {
        attName: string;
        val: string[];
      }[]
    >([]);
  const router = useRouter();

  useEffect(() => {
    const tempObj: { [key: string]: Set<string> } = {};
    product?.attributes.forEach((att) => {
      if (att.attributeCategory.type === 'multi-select') {
        if (!tempObj[att.attributeCategory.name]) {
          tempObj[att.attributeCategory.name] = new Set();
        }
        att.value.split(',').forEach((val) => {
          tempObj[att.attributeCategory.name].add(val);
        });
      }
    });
    const Arr: { attName: string; val: string[] }[] = [];
    Object.entries(tempObj).forEach(([attName, values]) => {
      if (Array.from(values).length > 1) {
        Arr.push({
          attName,
          val: Array.from(values),
        });
      }
    });
    setSelectableProductAttributes(Arr);
  }, [product]);

  const handleSelectAttribute = (attributeName: string, val: string) => {
    setSelectedProductAttributes((prevAttributes) => {
      const existingIndex = prevAttributes.findIndex(
        (att) => att.attName === attributeName
      );

      if (existingIndex !== -1) {
        const updatedAttributes = [...prevAttributes];
        updatedAttributes[existingIndex] = { attName: attributeName, val };
        return updatedAttributes;
      } else {
        return [...prevAttributes, { attName: attributeName, val }];
      }
    });
  };

  useEffect(() => {
    if (user && product?.favorites) {
      setIsFavorite(product?.favorites[0]?.userId === user?.id);
    }
  }, [user, product?.favorites]);

  const handleToggleFavorite = useCallback(async () => {
    if (!user) {
      router.push('/signin');
      return;
    }

    const newFavoriteState = !isFavorite;
    setIsFavorite(newFavoriteState);

    try {
      const result = await toggleFavorite({
        productId: product?.id!,
        productSlug: product?.slug!,
      });
      if (result.error) {
        setIsFavorite(!newFavoriteState);
        toast.error(result.error);
      } else if (result.success) {
        toast.success(result.success);
      }
    } catch (error) {
      setIsFavorite(!newFavoriteState);
      toast.error('An unexpected error occurred');
    }
  }, [user, router, isFavorite]);

  const handleAddToCart = () => {
    console.log('add to cart');
  };

  const images = useMemo(() => {
    return product?.images.map((image) => image.url) || [];
  }, [product?.images]);

  return (
    <div>
      <section className="lg:flex pt-0 lg:pt-10 justify-between gap-10">
        <div className="hidden lg:block">
          <StickyImageScroll images={images} />
        </div>
        <div className="lg:hidden md:px-8">
          <Carousel className="w-full h-full">
            <CarouselContent>
              {product?.images?.map((image, index) => (
                <CarouselItem key={image.id}>
                  <div className="relative aspect-square w-full">
                    <Image
                      src={image.url}
                      alt={`${product.name} - Image ${index + 1}`}
                      fill
                      className={cn('object-cover')}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={index === 0}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              <CarouselPrevious className="relative translate-y-0 left-0 h-8 w-8 bg-transparent border-none backdrop-blur-lg text-accent-foreground" />
              <CarouselNext className="relative translate-y-0 right-0 h-8 w-8 bg-transparent border-none backdrop-blur-lg text-accent-foreground" />
            </div>
          </Carousel>
        </div>
        <div className="lg:sticky top-[50px] lg:max-w-[500px] min-w-[350px] w-full flex-1 h-full pt-10 px-6">
          <div className="h-[100vh]">
            <div className="">
              <h3
                style={teko.style}
                className="text-4xl flex items-center justify-between gap-2"
              >
                {product?.name}
                <button
                  onClick={handleToggleFavorite}
                  className="h-8 w-8 cursor-pointer flex items-center justify-center overflow-hidden rounded-full bg-gray-50 shadow-sm group"
                >
                  <IoMdHeart
                    className={`h-6 w-6 transition-colors duration-300 group-hover:text-black ${
                      isFavorite ? 'text-black' : 'text-gray-300'
                    }`}
                  />
                </button>
              </h3>
              <p className="soft-text">{product?.brand}</p>
            </div>
            <div className="flex gap-3 rounded-md">
              <div className="flex gap-2 font-medium">
                <p className="text-gray-400">Store:</p>
                <Link
                  href={`/s/${product?.store?.slug}`}
                  className="inline text-indigo-500 hover:text-destructive"
                >
                  {product?.store?.storeName}
                </Link>
              </div>
            </div>
            {selectableProductAttributes &&
              selectableProductAttributes.length > 0 && (
                <div className="flex flex-col gap-4 mt-6">
                  {selectableProductAttributes?.map((attribute) => {
                    if (attribute.val.length > 1) {
                      return (
                        <ProductSelectableAttr
                          key={attribute.attName}
                          categoryAttribute={attribute}
                          selectedValue={
                            selectedProductAttributes.find(
                              (att) => att.attName === attribute.attName
                            )?.val
                          }
                          onSelect={handleSelectAttribute}
                        />
                      );
                    }
                  })}
                </div>
              )}
            <div className="py-4">
              <p className="text-sm text-muted-foreground">Price</p>
              <h3 className="text-2xl font-semibold">${product?.price}</h3>
            </div>

            <div className="mt-2">
              <div>
                <button
                  onClick={handleAddToCart}
                  className={`rounded-md w-full bg-primary px-4 py-2 text-white transition-colors`}
                >
                  Add to Cart
                </button>
              </div>
            </div>
            <ProductDetailsAccordion product={product} />
          </div>
        </div>
      </section>
    </div>
  );
}

export default ProductShow;
