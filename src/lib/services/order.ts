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
        orderToStores: {
          with: {
            order: {
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
    // const queryRes = await db
    //   .select({
    //     ...getTableColumns(schema.orders),
    //     user: getTableColumns(schema.users),
    //     orderItem: getTableColumns(schema.orderItems),
    //     product: getTableColumns(schema.products),
    //   })
    //   .from(schema.ordersToStore)
    //   .where(
    //     and(
    //       eq(schema.ordersToStore.storeId, storeId),
    //       eq(schema.orders.orderStatus, 'COMPLETED')
    //     )
    //   )
    //   .leftJoin(
    //     schema.orders,
    //     eq(schema.orders.id, schema.ordersToStore.orderId)
    //   )
    //   .leftJoin(schema.users, eq(schema.orders.userId, schema.users.id))
    //   .leftJoin(
    //     schema.orderItems,
    //     eq(schema.orderItems.orderId, schema.orders.id)
    //   )
    //   .leftJoin(
    //     schema.products,
    //     eq(schema.products.id, schema.orderItems.productId)
    //   )
    //   .orderBy(desc(schema.orders.createdAt))
    //   .limit(10)
    //   .groupBy(
    //     schema.orders.id,
    //     schema.users.id,
    //     schema.products.id,
    //     schema.orderItems.id
    //   );
    // const ordersObj: Record<string, TOrderWithDetails> = {};
    // const orderItemsObj: Record<
    //   string,
    //   (schema.TOrderItem & { product: schema.TProduct })[]
    // > = {};
    // queryRes.forEach((item) => {
    //   const tempOrderObj = item.id;
    //   if(!orderObj){

    //   }
    // })
    // queryRes.forEach((item) => {
    //   const orderItemsArr = orderItemsObj[item?.orderItem?.orderId!];
    //   const newOrderItemObj = { ...item.orderItem!, product: item.product! };
    //   if (!orderItemsArr) {
    //     orderItemsObj[item?.orderItem?.orderId!] = [newOrderItemObj];
    //   } else {
    //     orderItemsArr.push(newOrderItemObj);
    //   }
    // });
    // console.log(orderItemsObj);
    return queryRes ?? null;
  } catch (error) {
    console.error('Error fetching orders:', error);
    return null;
  }
};
