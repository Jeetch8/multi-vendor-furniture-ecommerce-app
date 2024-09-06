import Image from 'next/image';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import {
  fetchStoreBySlug,
  fetchStoreRatingByStore,
} from '@/lib/services/store';
import { MdOutlineVerified, MdStorefront, MdStar } from 'react-icons/md';
import ProductCarousel from '@/components/shared/ui/ProductCarousel';
import EmptyProductCarousel from '@/components/main/p/EmptyProductCarousel';
import { fetchStoreProductsWithOptions } from '@/lib/services/store';

type MainStorePage = {
  params: {
    'store-slug': string;
  };
};

async function MainStorePage({ params }: MainStorePage) {
  const storeSlug = params['store-slug'];
  const storeRating = await fetchStoreRatingByStore(storeSlug);
  const store = await fetchStoreBySlug(storeSlug);
  if (!store) {
    return notFound();
  }
  const bestSellingProducts = await fetchStoreProductsWithOptions(
    store?.id,
    'mostSelling'
  );
  const latestProducts = await fetchStoreProductsWithOptions(
    store?.id,
    'latestProducts'
  );
  const sortByFavorite = await fetchStoreProductsWithOptions(
    store?.id,
    'sortByFavorite'
  );

  return (
    <div className="flex flex-col gap-12 bg-white p-6">
      <div className="flex items-start gap-6 rounded-lg border px-3 py-6">
        <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-green-500 shadow-lg">
          <Image
            src={store?.img || ''}
            fill
            alt="store image"
            className="object-cover"
          />
        </div>
        <div className="flex-grow">
          <div className="mb-2 flex items-center gap-2">
            <h1 className="text-3xl font-bold text-gray-800">
              {store?.storeName}
            </h1>
            {store?.isVerified && (
              <MdOutlineVerified
                className="h-6 w-6 text-green-500"
                title="Verified Seller"
              />
            )}
          </div>
          <div className="flex items-center gap-4 text-gray-600">
            <div className="flex items-center">
              <MdStar className="mr-1 h-5 w-5 text-yellow-400" />
              <span className="font-semibold">
                {storeRating?.rating
                  ? storeRating.rating.toFixed(1)
                  : 'Not rated yet'}
              </span>
            </div>
            <div className="flex items-center">
              <MdStorefront
                className="mr-1 h-5 w-5 text-orange-1"
                title="store"
              />
            </div>
          </div>
        </div>
      </div>
      <section className="mt-6 flex flex-col gap-16 rounded-md p-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">Store latests</h3>
          <Suspense fallback={<EmptyProductCarousel length={8} />}>
            <ProductCarousel products={latestProducts} />
          </Suspense>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-800">
            Store&apos;s top favorites
          </h3>
          <Suspense fallback={<EmptyProductCarousel length={8} />}>
            <ProductCarousel products={sortByFavorite} />
          </Suspense>
        </div>

        <div>
          <h3 className="text-2xl font-bold text-gray-800">
            Store&apos;s best sellers
          </h3>
          <Suspense fallback={<EmptyProductCarousel length={8} />}>
            <ProductCarousel products={bestSellingProducts} />
          </Suspense>
        </div>
      </section>
    </div>
  );
}

export default MainStorePage;
