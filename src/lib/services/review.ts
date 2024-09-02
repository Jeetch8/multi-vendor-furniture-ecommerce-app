'use server';

import { TReviewForAccount } from '@/types/Review';
import { db } from '../db';
import { reviews } from '../schema';
import { eq } from 'drizzle-orm';

export const fetchReviewsByUser = async (
  userId: string
): Promise<TReviewForAccount[] | null> => {
  try {
    const res = await db.query.reviews.findMany({
      where: eq(reviews.userId, userId),
      with: {
        user: true,
        product: true,
      },
    });

    return res;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return null;
  }
};
