'use server';

import { revalidatePath, revalidateTag } from 'next/cache';

import { db } from '@/lib/db';
import { getUserById } from '@/lib/services/user';
import { cartPath } from '@/utils/paths';
import { carts } from '@/lib/schema';
import { eq } from 'drizzle-orm';

const deleteCart = async (userId: string) => {
  const currentUser = await getUserById(userId);

  if (currentUser?.cart && currentUser?.cart.id) {
    await db.delete(carts).where(eq(carts.id, currentUser.cart.id));

    revalidatePath(cartPath);
    revalidateTag('cart');
  } else {
    return null;
  }

  // TODO: fix the unexpected behaviour (cant' revalidate cart)
};

export default deleteCart;
