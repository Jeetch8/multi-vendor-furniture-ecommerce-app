import { inArray } from 'drizzle-orm';
import { stores } from '../schema/store.schema';
import { db } from '../db';
import { TStoreForCheckout } from '@/types/Store';

export const getStoresByIds = async (
  storeIds: string[]
): Promise<TStoreForCheckout[]> => {
  const res = await db.query.stores.findMany({
    where: inArray(stores.id, storeIds),
    with: {
      storeToCarriers: {
        with: {
          carrier: {
            with: {
              shippingRates: true,
            },
          },
        },
      },
    },
  });

  return res;
};
