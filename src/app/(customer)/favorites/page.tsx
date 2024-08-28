import { fetchFavoritesByUser } from '@/lib/services/favorite';
import ProductCard from '@/components/shared/ui/ProductCard';
import { auth } from '@/lib/auth';
import { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ProductsListSkeleton from '@/components/shared/skeleton/ProductsListSkeleton';

async function FavoritesPage() {
  const session = await auth();
  const user = session?.user;

  if (!user || !user?.id) {
    return <p>Sign in to add to favorites</p>;
  }

  const favorites = await fetchFavoritesByUser(user?.id);

  if (!favorites || favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[40vh]">
        <h1 className="text-3xl font-bold">No favorites found</h1>
        <Link href="/" className="mt-4">
          <Button>Go to Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <Suspense fallback={<ProductsListSkeleton />}>
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-4">
        {favorites?.map((f) => (
          <ProductCard key={f.id} product={f.product} />
        ))}
      </section>
    </Suspense>
  );
}

export default FavoritesPage;
