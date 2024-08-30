'use client';

import { Button } from '@/components/ui/button';
import { TCartWithDetails } from '@/types/Cart';
import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useState, useTransition } from 'react';
import { changeQuantity, deleteFromCart } from '@/actions/cart';
import ProductPriceDisplay from '@/components/shared/ui/ProductPriceDisplay';
import MiniSpinner from '@/components/shared/ui/MiniSpinner';
import Link from 'next/link';
interface CartProductCardProps {
  item: TCartWithDetails['cartItems'][number];
}

export default function CartProductCard({ item }: CartProductCardProps) {
  const { product, selectedAttributes } = item;
  const [isPending, startTransition] = useTransition();
  const [quantity, setQuantity] = useState<number>(item.quantity);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) {
      handleDelete(item.productId, item.id);
      return;
    }

    startTransition(async () => {
      await changeQuantity({
        value: newQuantity,
        productId: item.productId,
        cartItemId: item.id,
        formState: {},
      });
      setQuantity(newQuantity);
    });
  };

  const handleDelete = (productId: string, cartItemId: string) => {
    startTransition(async () => {
      await deleteFromCart({ productId, cartItemId, formState: {} });
    });
  };

  return (
    <div className="relative flex gap-4 py-4 border-b last:border-b-0 h-fit">
      {isPending && (
        <div className="absolute inset-0 bg-background/60 backdrop-blur-[1px] flex items-center justify-center z-10">
          <MiniSpinner />
        </div>
      )}

      <div className="relative h-32 w-32 flex-shrink-0">
        <Image
          src={product.images[0]?.smUrl || '/images/product-placeholder.png'}
          alt={product.name}
          fill
          className="object-cover rounded-sm"
        />
      </div>
      <div className="flex-grow flex flex-col justify-between">
        <div>
          <Link
            href={`/p/${product.slug}`}
            className="font-medium line-clamp-1"
          >
            {product.name}
          </Link>
          <div className="mt-1 space-y-1">
            {(selectedAttributes as { attName: string; val: string }[]).map(
              (obj, ind) => (
                <p key={ind} className="text-sm text-muted-foreground">
                  {obj.attName}: {obj.val}
                </p>
              )
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={isPending}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-8 text-center">{quantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={isPending}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-end justify-between">
        <div className="text-right">
          <ProductPriceDisplay
            product={product}
            showOldPrice={true}
            showTotalSavings={false}
            quantity={quantity}
          />
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
          onClick={() => handleDelete(product.id, item.id)}
          disabled={isPending}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
