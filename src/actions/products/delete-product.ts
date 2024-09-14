'use server';

import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { TProduct } from '@/lib/schema';
import { fetchProductsByStoreId } from '@/lib/services/product';
import { productsTablePath } from '@/utils/paths';
import { revalidatePath } from 'next/cache';
import * as schema from '@/lib/schema';
import { eq } from 'drizzle-orm';

type FormStateType = {
  error?: { message?: string };
  success?: { message?: string };
};

const deleteProduct = async (
  id: string,
  formState: FormStateType
): Promise<FormStateType> => {
  const session = await auth();

  if (!session || !session.user || !session?.user?.store) {
    return {
      error: {
        message: 'You must be signed in to do this',
      },
    };
  }

  const { products } = await fetchProductsByStoreId({
    storeId: session.user.store.id,
  });
  const productIds = products?.map((product: TProduct) => product.id);

  if (!productIds?.includes(id)) {
    return {
      error: {
        message: 'You are not allowed to do that',
      },
    };
  }

  try {
    await db.delete(schema.products).where(eq(schema.products.id, id));
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        error: {
          message: err.message,
        },
      };
    } else {
      return {
        error: {
          message: 'Something went wrong',
        },
      };
    }
  }

  revalidatePath(productsTablePath);

  return {
    success: {
      message: 'Product successfully deleted',
    },
  };
};

export default deleteProduct;
