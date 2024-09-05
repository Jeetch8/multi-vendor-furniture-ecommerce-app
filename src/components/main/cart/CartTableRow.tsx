'use client';

import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';

import ProductPriceDisplay from '@/components/shared/ui/ProductPriceDisplay';
import { TableCell, TableRow } from '@/components/ui/table';
import { TCartWithDetails } from '@/types/Cart';

import { changeQuantity, deleteFromCart } from '@/actions/cart';
import { FormStateType } from '@/actions/cart/delete-from-cart';
import { useEffect, useState, useTransition } from 'react';
import { MdOutlineArrowDropDown, MdOutlineArrowDropUp } from 'react-icons/md';
import { RxCross1 } from 'react-icons/rx';

type SelectedAttribute = {
  val: string;
  attName: string;
};

type CartTableRowType = {
  item: TCartWithDetails['cartItems'][number];
};

function CartTableRow({ item }: CartTableRowType) {
  const [isPending, startTransition] = useTransition();
  const [formState, setFormState] = useState<FormStateType | undefined>();
  const [quantity, setQuantity] = useState<number>(item.quantity);

  const handleDelete = (productId: string, cartItemId: string) => {
    startTransition(async () => {
      let res = await deleteFromCart({ productId, cartItemId, formState: {} });

      setFormState(res);
    });
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) {
      handleDelete(item.productId, item.id);
      return;
    }

    startTransition(async () => {
      const res = await changeQuantity({
        value: newQuantity,
        productId: item.productId,
        cartItemId: item.id,
        formState: {},
      });
      setQuantity(newQuantity);
      setFormState(res);
    });
  };

  useEffect(() => {
    if (formState?.success && formState?.success.message) {
      toast.success(formState?.success.message);
    }
  }, [formState]);

  return (
    <TableRow className={`${isPending && 'animate-pulse blur-sm'}`}>
      <TableCell>
        <Link
          href={`/p/${item.product.slug}`}
          className="relative block h-[120px] rounded-md border bg-white"
        >
          <Image
            fill
            src={item.product.images[0].url}
            alt={item.product.images[0].alt || 'Product Image'}
            className="object-contain"
          />
        </Link>
      </TableCell>

      <TableCell>
        <Link href={`/p/${item.product.slug}`}>
          <div className="flex">
            <p>
              <span className="font-semibold">{item.product.brand}</span>{' '}
              {item.product.name}
            </p>
          </div>
          <div className="flex gap-3">
            {(item.selectedAttributes as SelectedAttribute[]).map(
              (att, index) => (
                <p key={index} className="text-gray-400">
                  {att.attName} : {att.val}
                </p>
              )
            )}
          </div>
        </Link>
      </TableCell>

      <TableCell>
        <ProductPriceDisplay product={item.product} />
      </TableCell>
      <TableCell>
        <input
          className="bg-transparent pl-1 outline-none w-[50px] h-[30px] bg-white"
          type="number"
          name="quantity"
          defaultValue={item.quantity}
          onChange={(e) => handleQuantityChange(Number(e.target.value))}
        />
      </TableCell>
      <TableCell className="font-semibold">
        <ProductPriceDisplay
          product={item.product}
          showOldPrice={false}
          showTotalSavings={false}
          quantity={item.quantity}
        />
      </TableCell>
      <TableCell>
        <button onClick={() => handleDelete(item.productId, item.id)}>
          <RxCross1 className="text-gray-400" />
        </button>
      </TableCell>
    </TableRow>
  );
}

export default CartTableRow;
