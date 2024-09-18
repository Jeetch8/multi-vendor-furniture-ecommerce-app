import { db } from '@/lib/db';
import { eq } from 'drizzle-orm';
import * as schema from '@/lib/schema';
import { TDiscountForDiscountTable } from '@/types/discount';

export const fetchDiscountsByStoreId = async (
  storeId: string
): Promise<TDiscountForDiscountTable[] | undefined> => {
  try {
    const query = await db.query.discounts.findMany({
      where: eq(schema.discounts.storeId, storeId),
      with: {
        category: true,
        product: true,
      },
    });
    return query;
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};
