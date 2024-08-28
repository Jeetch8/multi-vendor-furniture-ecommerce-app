'use server';

import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { productShow } from '@/utils/paths';
import { revalidatePath, revalidateTag } from 'next/cache';
import { eq } from 'drizzle-orm';
import { favorites } from '@/lib/schema';

type FormStateType = {
  error?: { message?: { [key: string]: string[] } };
  success?: { message?: string };
};

type AddToFavoritesType = {
  favoriteId: string;
  productSlug: string;
  formState: FormStateType;
};

const deleteFromFavorites = async ({
  favoriteId,
  productSlug,
  formState,
}: AddToFavoritesType): Promise<FormStateType> => {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return {
      error: { message: { auth: ['You must be signed in to do this.'] } },
    };
  }
  let favorite;
  try {
    const fav = await db.query.favorites.findFirst({
      where: (favorites, { eq }) => eq(favorites.id, favoriteId),
    });

    if (!fav) {
      return {
        error: { message: { auth: ["It's not in your favorite list."] } },
      };
    }

    favorite = await db.delete(favorites).where(eq(favorites.id, favoriteId));
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
  revalidatePath(productShow(productSlug));

  return {
    success: {
      message: 'Succesfully added to favorites.',
    },
  };
};

export default deleteFromFavorites;
