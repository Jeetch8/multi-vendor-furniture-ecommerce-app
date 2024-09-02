'use server';

import { db } from '../db';
import { eq } from 'drizzle-orm';
import { addresses, TAddress } from '../schema';

export const fetchAddressesByUser = (userId: string): Promise<TAddress[]> => {
  try {
    const res = db.query.addresses.findMany({
      where: eq(addresses.userId, userId),
    });
    return res;
  } catch (error) {
    console.error('Error fetching addresses:', error);
    throw new Error("Couldn't fetch addresses");
  }
};
