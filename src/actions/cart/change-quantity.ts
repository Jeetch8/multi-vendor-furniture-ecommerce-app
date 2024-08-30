'use server';

import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { cartItems, carts } from '@/lib/schema';
import { fetchCartByUser } from '@/lib/services/cart';
import { eq } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';

export type FormStateType = {
  error?: { message?: string[] };
  success?: { message?: string };
};

type ChangeQuantityProps = {
  value: number;
  productId: string;
  cartItemId: string;
  formState: FormStateType;
};

const changeQuantity = async ({
  value,
  productId,
  cartItemId,
  formState,
}: ChangeQuantityProps) => {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return { error: { message: ['You must be signed in to do this.'] } };
  }

  const cart = await fetchCartByUser(user.id as string);

  const isOwnProduct = cart?.cartItems.some((item) => {
    if (item.productId === productId) {
      return true;
    }
  });

  if (!isOwnProduct) {
    return {
      error: {
        message: ['You do not have permission to do that.'],
      },
    };
  }

  try {
    await db
      .update(cartItems)
      .set({
        quantity: value,
      })
      .where(eq(cartItems.id, cartItemId))
      .execute();
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        error: {
          message: [err.message],
        },
      };
    } else {
      return {
        error: {
          message: ['Something went wrong.'],
        },
      };
    }
  }

  revalidateTag('cart');

  return {
    success: {
      message: 'Cart updated!',
    },
  };
};

export default changeQuantity;
