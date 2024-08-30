'use server';

import { db } from '@/lib/db';
import { fetchCartByUser } from '@/lib/services/cart';
import { auth } from '@/lib/auth';
import { revalidateTag } from 'next/cache';
import { eq } from 'drizzle-orm';
import { cartItems } from '@/lib/schema';

export type FormStateType = {
  error?: { message?: string[] };
  success?: { message?: string };
};

type DeleteFromCartProps = {
  cartItemId: string;
  productId: string;
  formState: FormStateType;
};

const deleteFromCart = async ({
  productId,
  cartItemId,
  formState,
}: DeleteFromCartProps): Promise<FormStateType> => {
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
        message: ['You do not have permission to do that'],
      },
    };
  }

  try {
    await db.delete(cartItems).where(eq(cartItems.id, cartItemId));
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
      message: 'Product successfully deleted from the cart.',
    },
  };
};

export default deleteFromCart;
