'use server';

import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { eq } from 'drizzle-orm';
import * as schema from '@/lib/schema';

const updateProductStatus = async (id: string, status: boolean) => {
  const session = await auth();

  if (!session || !session.user || !session.user.id || !session.user.store) {
    throw new Error('You have to signed in to that');
  }

  let product;
  try {
    product = await db.query.products.findFirst({
      where: eq(schema.products.id, id),
    });
  } catch {
    throw new Error('An unexpected error occurred');
  }

  if (product?.storeId !== session.user.store.id) {
    throw new Error('Store not found');
  }

  try {
    await db
      .update(schema.products)
      .set({ status })
      .where(eq(schema.products.id, id));
  } catch (error) {
    console.error(error);
    throw new Error('An unexpected error occurred');
  }
};

export default updateProductStatus;
