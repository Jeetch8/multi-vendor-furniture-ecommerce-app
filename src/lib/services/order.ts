import { and, desc, eq, getTableColumns, ne, or, sql } from 'drizzle-orm';
import { db } from '../db';
import * as schema from '../schema';
import { auth } from '../auth';
import { TOrderForMyOrders, TOrderWithDetails } from '@/types/Order';

export const fetchOrdersByUser = async (
  id: string
): Promise<TOrderForMyOrders[]> => {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    throw new Error('Failed to fetch orders');
  }

  try {
    const orders = await db.query.orders.findMany({
      where: eq(schema.orders.userId, id),
      with: {
        orderItems: true,
        orderToStores: {
          with: {
            shipment: true,
            shippingAddress: true,
            store: true,
            orderItems: {
              with: {
                product: {
                  with: {
                    images: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    return orders;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw new Error('Failed to fetch orders');
  }
};

export const fetchOrdersWithoutReviewsByUser = async (userId: string) => {
  try {
    const ordersRes = await db.query.orders.findMany({
      where: and(
        eq(schema.orders.userId, userId),
        eq(schema.orders.orderStatus, 'COMPLETED')
      ),
      with: {
        orderItems: {
          with: {
            product: {
              with: {
                images: true,
                reviews: {
                  where: ne(schema.reviews.userId, userId),
                },
              },
            },
          },
        },
      },
    });
    return ordersRes;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw new Error('Failed to fetch orders');
  }
};

export const fetchOrdersByStoreId = async ({
  storeId,
  sortBy,
  currentPage,
  itemsPerPage,
  querySearch,
  filter,
}: {
  storeId: string;
  sortBy?: 'createdAt' | 'totalPrice';
  currentPage?: number;
  itemsPerPage?: number;
  querySearch?: string;
  filter?: string;
}) => {
  try {
    const queryRes = await db.query.ordersToStore.findMany({
      where: eq(schema.ordersToStore.storeId, storeId),
      with: {
        order: {
          with: {
            user: true,
            orderItems: {
              with: {
                product: true,
              },
            },
          },
        },
      },
    });

    return queryRes ?? null;
  } catch (error) {
    console.error('Error fetching orders:', error);
    return null;
  }
};
