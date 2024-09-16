'use client';

import Image from 'next/image';
import { useState } from 'react';

import { updateProductStatus } from '@/actions/products';
import {
  calculateTotalProductRating,
  formatDate,
  formatDateSecondary,
} from '@/utils/helpers';

import { ProductPriceDisplay } from '@/components/shared/ui';
import Rating from '@/components/shared/ui/Rating';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Switch } from '@/components/ui/switch';
import { TableCell, TableRow } from '@/components/ui/table';
import { useCategories } from '@/Context/CategoryContext';
import ProductRowOperations from './ProductRowOperations';
import { TProductForTable } from '@/types/Product';

function CustomTableRow({
  product,
  index,
}: {
  product: TProductForTable;
  index: number;
}) {
  const [switchState, setSwitchState] = useState<boolean>(product.status!);

  const handleCheckedChange = (newValue: boolean) => {
    setSwitchState(newValue);
    updateProductStatus(product.id, newValue);
  };

  const { categories } = useCategories();

  let rating;
  if (product.reviews && product.reviews.length > 0)
    rating = calculateTotalProductRating(product.reviews);

  return (
    <TableRow key={product.id}>
      <TableCell>{index + 1}</TableCell>
      <TableCell>
        <div className="relative h-10 w-10 p-2">
          {product?.images[0]?.url ? (
            <Image
              className="w-auto object-center"
              src={product.images[0].url}
              alt={product.name || 'product image'}
              fill
            />
          ) : (
            <p></p>
          )}
        </div>
      </TableCell>
      <TableCell className="text-center">
        <Switch
          id="airplane-mode"
          checked={switchState}
          onCheckedChange={handleCheckedChange}
          className="data-[state=checked]:bg-blue-200"
        />
      </TableCell>

      <TableCell className="text-center">{product.stock}</TableCell>
      <TableCell className="font-semibold">{product.name}</TableCell>
      <TableCell className="flex flex-col">
        {product.categoryToProducts.map((cat) => (
          <p key={cat.id}>{cat.category.name}</p>
        ))}
      </TableCell>
      <TableCell>
        <Rating value={rating ?? -1} size={5} editable={false} />
      </TableCell>
      <TableCell className="text-center">
        <ProductPriceDisplay product={product} />
      </TableCell>
      <TableCell className="text-center">{product.favorite_count!}</TableCell>
      <TableCell>{product.brand}</TableCell>
      <TableCell>
        <HoverCard openDelay={200}>
          <HoverCardTrigger className="soft-text">
            {formatDate(product.createdAt!)}
          </HoverCardTrigger>
          <HoverCardContent className="w-[100%]">
            {formatDateSecondary(product.createdAt!)}
          </HoverCardContent>
        </HoverCard>
      </TableCell>
      <TableCell>
        <HoverCard openDelay={200}>
          <HoverCardTrigger className="soft-text">
            {formatDate(product.updatedAt!)}
          </HoverCardTrigger>
          <HoverCardContent className="w-[100%]">
            {formatDateSecondary(product.updatedAt!)}
          </HoverCardContent>
        </HoverCard>
      </TableCell>

      <TableCell>
        <ProductRowOperations product={product} categories={categories} />
      </TableCell>
    </TableRow>
  );
}

export default CustomTableRow;
