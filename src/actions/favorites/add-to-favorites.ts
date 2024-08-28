'use server';

import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { favorites } from '@/lib/schema';
import { revalidateTag } from 'next/cache';

type FormStateType = {
  error?: { message?: { [key: string]: string[] } };
  success?: { message?: string };
};

type AddToFavoritesType = {
  productId: string;
  formState: FormStateType;
};

const addToFavorites = async ({
  productId,
  formState,
}: AddToFavoritesType): Promise<FormStateType> => {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return {
      error: { message: { auth: ['You must be signed in to do this.'] } },
    };
  }

  try {
    const fav = await db.query.favorites.findFirst({
      where: (favorites, { eq }) => eq(favorites.productId, productId),
    });

    if (fav) {
      return {
        error: { message: { auth: ["It's already in your favorite list."] } },
      };
    }

    await db.insert(favorites).values({
      userId: user?.id!,
      productId,
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

  revalidateTag('favorites');

  return {
    success: {
      message: 'Succesfully added to favorites.',
    },
  };
};

export default addToFavorites;
