import { fetchSimilarProducts } from '@/lib/services/product';
import EmptyProductCarousel from '@/components/main/p/EmptyProductCarousel';
import ProductCarousel from '@/components/shared/ui/ProductCarousel';
import React, { Suspense } from 'react';
type PageProps = {
  params: { 'product-slug': string };
};

const SimilarProductsPage = async ({ params }: PageProps) => {
  const productSlug = params['product-slug'];
  const smillarProductResult = await fetchSimilarProducts(productSlug);

  return <ProductCarousel products={smillarProductResult ?? []} />;
};

export default SimilarProductsPage;
