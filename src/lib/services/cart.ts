import { TCartWithDetails } from '@/types/Cart';
import { unstable_cache } from 'next/cache';
import { db } from '../db';
import { eq } from 'drizzle-orm';
import { carts } from '../schema';

export const fetchCartByUser = unstable_cache(
  async (userId: string): Promise<TCartWithDetails | null> => {
    try {
      const res = await db.query.carts.findFirst({
        where: eq(carts.userId, userId),
        with: {
          cartItems: {
            with: {
              product: {
                with: {
                  images: true,
                  discount: {
                    with: {
                      categories: true,
                      products: true,
                    },
                  },
                  store: true,
                  categoryToProducts: {
                    with: {
                      category: {
                        with: {
                          discount: true,
                        },
                      },
                    },
                  },
                  attributes: {
                    with: {
                      attributeCategory: true,
                      product: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
      if (res === undefined) return null;
      return res;
    } catch (err) {
      return null;
    }
  },
  ['user-cart'],
  { tags: ['cart'], revalidate: 30 }
);
