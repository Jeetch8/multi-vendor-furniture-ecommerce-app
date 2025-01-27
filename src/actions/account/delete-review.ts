'use server';

import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { fetchReviewsByUser } from '@/lib/services/review';
import { eq } from 'drizzle-orm';
import { reviews } from '@/lib/schema';

export type FormStateType = {
  error?: { message?: string[] };
  success?: { message?: string };
};

type DeleteFromCartProps = {
  reviewId: string;
  formState: FormStateType;
};

const deleteReview = async (
  reviewId: string,
  formState: FormStateType
): Promise<FormStateType> => {
  const session = await auth();
  const user = session?.user;

  if (!user || !user.id) {
    return { error: { message: ['You must be signed in to do this.'] } };
  }

  const reviewsResponse = await fetchReviewsByUser(user.id);

  const isHisReview = reviewsResponse?.some((r) => r.id === reviewId);

  if (!isHisReview) {
    return { error: { message: ['You do not have a permission to do that.'] } };
  }

  try {
    await db.delete(reviews).where(eq(reviews.id, reviewId));
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        error: {
          message: [err.message],
        },
      };
    } else {
      return {
        error: {
          message: ['Something went wrong.'],
        },
      };
    }
  }

  return {
    success: {
      message: 'Review successfully deleted.',
    },
  };
};

export default deleteReview;
