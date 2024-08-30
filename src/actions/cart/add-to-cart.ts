'use server';

import { addCartSchema } from '@/lib/validation/cart';
import { revalidateTag } from 'next/cache';
import { eq } from 'drizzle-orm';
import { cartItems, carts, products } from '@/lib/schema';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

type FormStateType = {
  error?: { message?: { [key: string]: string[] } };
  success?: { message?: string };
};

type addToCart = {
  productId: string;
  options: {
    attName: string;
    val: string;
  }[];
  formState: FormStateType;
};

const addToCart = async ({
  productId,
  options,
  formState,
}: addToCart): Promise<FormStateType> => {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return {
      error: { message: { auth: ['You must be signed in to do this.'] } },
    };
  }

  const product = await db.query.products.findFirst({
    where: eq(products.id, productId),
    with: {
      attributes: {
        with: {
          attributeCategory: true,
        },
      },
    },
  });

  if (!product) {
    return { error: { message: { general: ['Product not found'] } } };
  }

  const selectableAttributes = product.attributes.filter(
    (attr) => attr.attributeCategory.type === 'multi-select'
  );

  const requiredSelectableAttributes = selectableAttributes
    .filter((attr) => attr.attributeCategory.required)
    .map((attr) => attr.attributeCategory.name);

  const validatedFields = addCartSchema.safeParse({ productId, options });

  if (!validatedFields.success) {
    return {
      error: { message: validatedFields.error.formErrors.fieldErrors },
    };
  }

  const missingAttributes = requiredSelectableAttributes.filter(
    (attr) => !options.some((opt) => opt.attName === attr)
  );

  if (missingAttributes.length > 0) {
    return {
      error: {
        message: {
          options: [
            `Missing required attributes: ${missingAttributes.join(', ')}`,
          ],
        },
      },
    };
  }

  const { productId: validatedId, options: validatedOptions } =
    validatedFields.data;

  try {
    let cart = await db.query.carts.findFirst({
      where: eq(carts.userId, user.id as string),
    });
    if (!cart) {
      cart = (
        await db
          .insert(carts)
          .values({ userId: user.id as string })
          .returning()
      )[0];
    }

    await db.insert(cartItems).values({
      cartId: cart.id,
      productId: validatedId,
      quantity: 1,
      selectedAttributes: validatedOptions,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        error: {
          message: { _form: [err.message] },
        },
      };
    } else {
      return {
        error: {
          message: { _form: ['Something went wrong.'] },
        },
      };
    }
  }

  revalidateTag('cart');

  return {
    success: {
      message: 'Succesfully added to cart.',
    },
  };
};

export default addToCart;
