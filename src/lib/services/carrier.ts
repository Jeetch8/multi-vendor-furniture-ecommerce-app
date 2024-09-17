import { eq } from 'drizzle-orm';
import { db } from '../db';
import * as schema from '@/lib/schema';

export const fetchCarriersByStore = async (storeId: string) => {
  try {
    const query = await db.query.storeToCarriers.findMany({
      where: eq(schema.storeToCarriers.storeId, storeId),
      with: {
        carrier: {
          with: {
            shippingRates: true,
          },
        },
      },
    });
    return query;
  } catch (error) {
    console.error('Error fetching carriers:', error);
    throw new Error("Couldn't fetch carriers");
  }
};
