import { unstable_cache } from 'next/cache';
import { db } from '../db';
import { favorites } from '../schema';
import { and, eq } from 'drizzle-orm';
import { TProductsForFavorites } from '@/types/Favorite';

export const fetchFavoritesByUser = unstable_cache(
  async (userId: string): Promise<TProductsForFavorites[] | null> => {
    try {
      const res = await db.query.favorites.findMany({
        where: eq(favorites.userId, userId),
        with: {
          product: {
            with: {
              images: true,
              discount: true,
              categoryToProducts: {
                with: {
                  category: {
                    with: {
                      discount: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
      return res ?? null;
    } catch (err) {
      return null;
    }
  },
  ['user-favorites'],
  { tags: ['favorites'], revalidate: 30 }
);

export const toggleFavorite = async ({
  productId,
  userId,
}: {
  productId: string;
  userId: string;
}) => {
  try {
    const isFavorite = await db.query.favorites.findFirst({
      where: and(
        eq(favorites.userId, userId),
        eq(favorites.productId, productId)
      ),
    });
    if (!isFavorite) {
      return await db
        .insert(favorites)
        .values({
          userId,
          productId,
        })
        .returning();
    } else {
      return await db
        .delete(favorites)
        .where(
          and(eq(favorites.userId, userId), eq(favorites.productId, productId))
        )
        .returning();
    }
  } catch (error) {
    return Error();
  }
};
