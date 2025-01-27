import { fetchReviewsByUser } from '@/lib/services/review';
import { ShoppingBag } from 'lucide-react';
import ReviewShowCard from './ReviewShowCard';
import { auth } from '@/lib/auth';

async function ReviewsList() {
  const session = await auth();
  const user = session?.user;
  const reviews = await fetchReviewsByUser(user?.id as string);

  return (
    <div className="w-full">
      {reviews && reviews.length > 0 ? (
        <div className="flex flex-wrap gap-x-2">
          {reviews.map((review) => (
            <ReviewShowCard key={review.id} review={review} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border bg-white p-8 text-center">
          <ShoppingBag size={48} className="mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium text-gray-600">
            You haven&apos;t written any reviews yet.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Once you make a purchase, you can share your thoughts here.
          </p>
        </div>
      )}
    </div>
  );
}

export default ReviewsList;
