import {
  and,
  avg,
  count,
  countDistinct,
  desc,
  eq,
  getTableColumns,
  gte,
  inArray,
  sql,
  sum,
  sumDistinct,
} from 'drizzle-orm';
import { stores } from '../schema/store.schema';
import { db } from '../db';
import { TStoreForCheckout } from '@/types/Store';
import { productImages, products } from '../schema/product.schema';
import {
  discounts,
  favorites,
  orderItems,
  orders,
  ordersToStore,
  reviews,
  users,
} from '../schema';
import { TProductCard } from '@/types/Product';
import { subDays } from 'date-fns';

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

export const fetchStoreProductsWithOptions = async (
  storeId: string,
  orderBy:
    | 'latestProducts'
    | 'sortByFavorite'
    | 'mostSelling' = 'latestProducts'
): Promise<TProductCard[]> => {
  const qr = db
    .select({
      ...getTableColumns(products),
      discount: getTableColumns(discounts),
      images: sql`jsonb_agg(${productImages})`,
    })
    .from(products)
    .where(eq(products.storeId, storeId))
    .leftJoin(productImages, eq(products.id, productImages.productId))
    .leftJoin(discounts, eq(products.discountId, discounts.id))
    .groupBy(products.id, discounts.id)
    .$dynamic();

  if (orderBy === 'sortByFavorite') {
    qr.orderBy(
      desc(sql`(${db.$count(favorites, eq(favorites.productId, products.id))})`)
    );
  } else if (orderBy === 'mostSelling') {
    qr.orderBy(
      desc(
        sql`(${db.$count(orderItems, eq(orderItems.productId, products.id))})`
      )
    );
  } else {
    qr.orderBy(desc(products.createdAt));
  }
  const res = await qr.execute();
  return res as TProductCard[];
};

export const fetchStoreBySlug = async (slug: string) => {
  const res = await db.query.stores.findFirst({
    where: eq(stores.slug, slug),
  });

  return res;
};

export const fetchStoreRatingByStore = async (storeId: string) => {
  const res = await db.query.stores.findFirst({
    where: eq(stores.id, storeId),
    with: {
      products: {
        with: {
          reviews: true,
        },
      },
    },
  });

  const rating = res?.products.reduce((acc, product) => {
    return (
      acc + product.reviews.reduce((acc, review) => acc + review.rating, 0)
    );
  }, 0);

  const ratingCount = res?.products.reduce((acc, product) => {
    return acc + product.reviews.length;
  }, 0);

  return { rating, ratingCount };
};

export const fetchStorePerformace = async (storeId: string) => {
  const ordersQuery = await db
    .select({
      totalSales: sum(orders.totalPrice),
      salesLastWeek: sum(
        sql`case when ${sql`${
          orders.createdAt
        } > ${sql`now() - interval '7 days'`}`} then ${
          orders.totalPrice
        } else 0 end`
      ),
      totalOrders: count(orders.id),
      ordersLastWeek: count(
        sql`case when ${sql`${
          orders.createdAt
        } > ${sql`now() - interval '7 days'`}`} then 1 else 0 end`
      ),
      totalCustomers: countDistinct(orders.userId),
      customersLastWeek: countDistinct(
        sql`case when ${sql`${
          orders.createdAt
        } > ${sql`now() - interval '7 days'`}`} then 1 else 0 end`
      ),
    })
    .from(ordersToStore)
    .where(eq(ordersToStore.storeId, storeId))
    .leftJoin(orders, eq(ordersToStore.orderId, orders.id));

  const lastWeekPerformace = await db
    .select({
      totalSales: sum(orders.totalPrice),
    })
    .from(ordersToStore)
    .where(
      and(
        eq(ordersToStore.storeId, storeId),
        gte(orders.createdAt, subDays(new Date(), 7))
      )
    )
    .leftJoin(orders, eq(ordersToStore.orderId, orders.id));

  return ordersQuery;
};
