import { db } from '@/lib/db';
import { eq, ilike, or } from 'drizzle-orm';
import { unstable_cache } from 'next/cache';
import { categories, products, searchHistory, stores } from '../schema';
import { TSearchResults } from '@/types/Search';
import { TProductCard } from '@/types/Product';

export const getSearchHistory = unstable_cache(
  async (userId: string) => {
    return await db.query.searchHistory.findMany({
      where: eq(searchHistory.userId, userId),
    });
  },
  ['search'],
  { tags: ['search-history'], revalidate: 10 }
);

export async function searchProductsCategoriesStores(
  query: string
): Promise<TSearchResults> {
  const res = await db.transaction(async (tx) => {
    const productsRes = await tx.query.products.findMany({
      where: or(eq(products.name, query), eq(products.brand, query)),
      with: {
        categoryToProducts: true,
      },
    });
    const categoriesRes = await tx.query.categories.findMany({
      where: eq(categories.name, query),
    });
    const storesRes = await tx.query.stores.findMany({
      where: eq(stores.storeName, query),
    });
    return {
      products: productsRes,
      categories: categoriesRes,
      stores: storesRes,
    };
  });

  return res;
}

export async function searchProducts(
  query: string,
  userId?: string
): Promise<TProductCard[]> {
  try {
    const res = await db.query.products.findMany({
      where: or(
        ilike(products.name, `%${query}%`),
        ilike(products.brand, `%${query}%`)
      ),
      with: {
        images: {
          limit: 1,
        },
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
      limit: 6,
    });
    if (userId) {
      await db.insert(searchHistory).values({
        query,
        userId,
      });
    }
    return res;
  } catch (error) {
    console.error(error);
    return [];
  }
}
