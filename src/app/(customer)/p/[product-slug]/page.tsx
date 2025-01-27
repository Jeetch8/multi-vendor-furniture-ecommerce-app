import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import {
  fetchAllProducts,
  fetchProductBySlug,
  fetchStoreRatingByProductSlug,
} from '@/lib/services/product';
import { getUrl } from '@/utils/helpers';
import ProductShow from '@/components/main/p/ProductShow';

type PageProps = {
  params: { 'product-slug': string };
};

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const productSlug = params['product-slug'];

  const product = await fetchProductBySlug({ productSlug, userId: undefined });

  if (!product) {
    return { title: 'Product Not Found' };
  }

  return {
    title: product.name,
    description: product.summary,
    metadataBase: new URL(getUrl()),
    openGraph: {
      title: product.name,
      description: product.summary,
      url: `${getUrl()}/p/${product.slug}`,
      siteName: 'Store',
      images: [
        {
          url: product.images[0]?.url || '/default-product-image.jpg',
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
      locale: 'us_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.summary,
      images: [product.images[0]?.url || '/default-product-image.jpg'],
    },
    other: {
      'og:product': 'product',
      'product:price:amount': product.price.toString(),
      'product:price:currency': 'USD',
      'product:availability': product.stock > 0 ? 'in stock' : 'out of stock',
      'product:brand': product.brand,
      'product:retailer': product.store.storeName,
    },
  };
}

export async function generateStaticParams(): Promise<
  Array<{ 'product-slug': string }>
> {
  const products = await fetchAllProducts();

  if (!products || products.length === 0) {
    return [];
  }

  return products.map((p: any) => ({
    'product-slug': p.slug.toString(),
  }));
}

async function ProductPage({ params }: PageProps) {
  const productSlug = params['product-slug'];

  const storeRating = await fetchStoreRatingByProductSlug(
    productSlug as string
  );

  if (!productSlug) {
    notFound();
  }

  const productRes = await fetchProductBySlug({
    productSlug,
    userId: undefined,
  });

  if (!productRes) {
    notFound();
  }

  return (
    <div className="mx-auto">
      <ProductShow product={productRes} storeRating={storeRating} />
    </div>
  );
}

export default ProductPage;
