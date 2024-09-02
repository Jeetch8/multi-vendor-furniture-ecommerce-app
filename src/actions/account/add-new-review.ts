'use server';

import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { fetchOrdersByUser } from '@/lib/services/order';
import { reviewSchema } from '@/lib/validation/account';
import { reviews } from '@/lib/schema';

type createNewProductFormState = {
  errors?: {
    rating?: string[];
    comment?: string[];
    _form?: string[];
  };
  success?: { message?: string; revalidated: boolean };
};

const createNewReview = async (
  formState: createNewProductFormState,
  formData: FormData
): Promise<createNewProductFormState> => {
  const validatedFields = reviewSchema.safeParse({
    rating: formData.get('rating'),
    comment: formData.get('comment'),
    productId: formData.get('productId'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const session = await auth();
  const user = session?.user;

  if (!user || !user.id) {
    return {
      errors: {
        _form: ['You must be signed in to do this.'],
      },
    };
  }

  const orders = await fetchOrdersByUser(user.id);

  const isItsOwnProduct = orders.some((o) =>
    o.orderToStores.some((i) =>
      i.orderItems.some((i) => i.productId === validatedFields.data.productId)
    )
  );

  if (!isItsOwnProduct) {
    return {
      errors: {
        _form: ['You do not have a permission to do that.'],
      },
    };
  }

  try {
    await db.insert(reviews).values({
      ...validatedFields.data,
      userId: user.id,
      productId: validatedFields.data.productId,
    });
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

  //   revalidatePath(paths.myReviews());

  return {
    success: { message: 'Your review successfully added.', revalidated: true },
  };
};

export default createNewReview;
