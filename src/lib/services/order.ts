import {
  and,
  asc,
  eq,
  getTableColumns,
  ilike,
  inArray,
  ne,
  or,
  sql,
} from 'drizzle-orm';
import { db } from '../db';
import * as schema from '../schema';
import { auth } from '../auth';
import { TOrderForMyOrders, TOrderforOrdersTable } from '@/types/Order';
import { getColStringForJSONBuildObj, jsonBuildObject } from '../utils';

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
}: {
  storeId: string;
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

export const fetchOrdersForOrdersTable = async ({
  storeId,
  currentPage = 1,
  filter,
  itemsPerPage = 10,
  querySearch,
  sortBy,
}: {
  storeId: string;
  sortBy?: {
    sort: string;
    order: 'asc' | 'desc';
  };
  currentPage?: number;
  itemsPerPage?: number;
  querySearch?: string;
  filter?: {
    filterByOrder: schema.orderStatusEnum[];
    filterByShipment: schema.shipmentStatusEnum[];
  };
}): Promise<{ orders: TOrderforOrdersTable[]; totalCount: number }> => {
  try {
    const whereArr: any[] = [];
    if (querySearch) {
      whereArr.push(
        ilike(schema.products.name, `%${querySearch}%`),
        ilike(schema.users.name, `%${querySearch}%`)
      );
    }
    if (filter) {
      if (filter.filterByOrder.length > 0) {
        whereArr.push(inArray(schema.orders.orderStatus, filter.filterByOrder));
      }
      if (filter.filterByShipment.length > 0) {
        whereArr.push(
          inArray(schema.shipments.status, filter.filterByShipment)
        );
      }
    }
    const query = (await db
      .select({
        ...getTableColumns(schema.ordersToStore),
        order: {
          ...getTableColumns(schema.orders),
          user: jsonBuildObject(getTableColumns(schema.users)),
        },
        shipment: { ...getTableColumns(schema.shipments) },
        shippingAddress: { ...getTableColumns(schema.addresses) },
        store: { ...getTableColumns(schema.stores) },
        orderItems: sql`json_agg(json_build_object( ${sql.raw(
          getColStringForJSONBuildObj(
            getTableColumns(schema.orderItems),
            'order_item'
          )
        )} , 'product', product))`,
      })
      .from(schema.ordersToStore)
      .where(
        and(
          eq(schema.ordersToStore.storeId, storeId),
          whereArr.length > 0 ? or(...whereArr) : undefined
        )
      )
      .leftJoin(
        schema.orders,
        eq(schema.ordersToStore.orderId, schema.orders.id)
      )
      .leftJoin(schema.users, eq(schema.orders.userId, schema.users.id))
      .leftJoin(
        schema.shipments,
        eq(schema.ordersToStore.id, schema.shipments.orderToStoreId)
      )
      .leftJoin(
        schema.addresses,
        eq(schema.ordersToStore.shippingAddressId, schema.addresses.id)
      )
      .leftJoin(
        schema.stores,
        eq(schema.ordersToStore.storeId, schema.stores.id)
      )
      .leftJoin(
        schema.orderItems,
        eq(schema.ordersToStore.orderId, schema.orderItems.orderId)
      )
      .leftJoin(
        schema.products,
        eq(schema.orderItems.productId, schema.products.id)
      )
      .orderBy(asc(schema.ordersToStore.createdAt))
      .limit(itemsPerPage)
      .offset((currentPage - 1) * itemsPerPage)
      .groupBy(
        schema.ordersToStore.id,
        schema.orders.id,
        schema.shipments.id,
        schema.addresses.id,
        schema.stores.id,
        schema.users.id
      )) as TOrderforOrdersTable[];

    const totalProductsCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(schema.ordersToStore)
      .where(eq(schema.ordersToStore.storeId, storeId));
    return { orders: query, totalCount: totalProductsCount[0].count };
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw new Error('Failed to fetch orders');
  }
};
