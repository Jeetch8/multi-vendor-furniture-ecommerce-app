'use server';

import { revalidatePath } from 'next/cache';
import { DateRange } from 'react-day-picker';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { getStoreByUserId } from '@/lib/services/store';
import { createNewDiscountSchema } from '@/lib/validation/store';
import * as schema from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { discountsShowPath } from '@/utils/paths';

type CreateNewDiscountState = {
  errors?: {
    name?: string[];
    description?: string[];
    discountPercent?: string[];
    categoryId?: string[];
    productId?: string[];
    date?: string[];
    _form?: string[];
  };
  success?: { message: string };
};

type AdditionalStatesType = {
  categoryId?: string;
  productId?: string;
  date: DateRange;
};

export default async function createNewDiscount(
  additionalStates: AdditionalStatesType,
  formState: CreateNewDiscountState,
  formData: FormData
): Promise<CreateNewDiscountState> {
  const validatedFields = createNewDiscountSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
    discountPercent: formData.get('discount_percent'),
    categoryId: additionalStates.categoryId,
    productId: additionalStates.productId,
    date: additionalStates.date,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  const session = await auth();
  const user = session?.user;

  if (!user || !user?.id) {
    return {
      errors: {
        _form: ['You must be signed in to do this.'],
      },
    };
  }

  const store = await getStoreByUserId(user.id);

  if (!store || !store.id) {
    return {
      errors: {
        _form: ['Store not found.'],
      },
    };
  }

  const { date, categoryId, productId, ...restData } = validatedFields.data;

  const discount: typeof schema.discounts.$inferInsert = {
    ...restData,
    discountPercent: String(restData.discountPercent),
    storeId: store.id,
    startDate: date.from,
    endDate: date.to,
  };

  try {
    const newDiscount = await db
      .insert(schema.discounts)
      .values(discount)
      .returning();

    if (categoryId) {
      await db
        .update(schema.categories)
        .set({
          discountId: newDiscount[0].id,
        })
        .where(eq(schema.categories.id, categoryId));
    }

    if (productId) {
      await db
        .update(schema.products)
        .set({
          discountId: newDiscount[0].id,
        })
        .where(eq(schema.products.id, productId));
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        errors: {
          _form: [err.message],
        },
      };
    } else {
      return {
        errors: {
          _form: ['Something went wrong'],
        },
      };
    }
  }

  revalidatePath(discountsShowPath);

  return {
    success: {
      message: 'Discount successfully been added.',
    },
  };
}
