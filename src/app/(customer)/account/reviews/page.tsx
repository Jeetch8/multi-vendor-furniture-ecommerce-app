import { Suspense } from 'react';

import ProductsForReview from '@/components/main/account/ProductsForReview';
import ReviewsList from '@/components/main/account/ReviewsList';
import MiniSpinner from '@/components/shared/ui/MiniSpinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ReviewsPage = async () => {
  return (
    <div className="w-full">
      <h3 className="text-2xl font-bold">Reviews</h3>
      <Tabs defaultValue="account" className="w-full">
        <TabsList>
          <TabsTrigger value="account">Rate</TabsTrigger>
          <TabsTrigger value="password">My Reviews</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <Suspense fallback={<MiniSpinner />}>
            <ProductsForReview />
          </Suspense>
        </TabsContent>
        <TabsContent value="password">
          <Suspense fallback={<MiniSpinner />}>
            <ReviewsList />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReviewsPage;
