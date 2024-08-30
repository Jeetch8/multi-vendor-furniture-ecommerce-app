'use server';

import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { revalidatePath, revalidateTag } from 'next/cache';
import { and, eq } from 'drizzle-orm';
import { favorites } from '@/lib/schema';
import { productShowPath } from '@/utils/paths';

export default async function toggleFavorite({
  productId,
  productSlug,
}: {
  productId: string;
  productSlug: string;
}) {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return { error: 'You must be signed in to do this.' };
  }

  try {
    const existingFavorite = await db.query.favorites.findFirst({
      where: (favorites, { eq }) =>
        and(eq(favorites.productId, productId), eq(favorites.userId, user.id!)),
    });

    if (existingFavorite) {
      await db.delete(favorites).where(eq(favorites.id, existingFavorite.id));
    } else {
      await db.insert(favorites).values({
        productId,
        userId: user.id!,
      });
    }

    revalidatePath(productShowPath(productSlug));
    revalidateTag('favorites');

    return { success: 'Favorite status updated successfully.' };
  } catch (err) {
    console.error(err);
    return { error: 'An error occurred while updating favorite status.' };
  }
}
