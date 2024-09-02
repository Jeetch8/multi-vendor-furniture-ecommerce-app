import { and, desc, eq, ne } from 'drizzle-orm';
import { db } from '../db';
import * as schema from '../schema';
import { auth } from '../auth';
import { TOrderForMyOrders } from '@/types/Order';

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
        orderToStores: {
          with: {
            orderItems: {
              with: {
                product: {
                  with: {
                    images: true,
                  },
                },
              },
            },
            store: true,
            shippingAddress: true,
            shipment: true,
          },
        },
        orderItems: true,
      },
      orderBy: desc(schema.orders.createdAt),
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
