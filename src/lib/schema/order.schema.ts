import {
  pgTable,
  text,
  timestamp,
  integer,
  uniqueIndex,
  json,
  numeric,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';
import { products } from './product.schema';
import { users } from './user.schema';
import { stores } from './store.schema';
import { coupons } from './coupon.schema';
import { addresses } from './address.schema';
import { shipments } from './shipment.schema';
import { enumToPgEnum } from '../utils';

export enum orderStatusEnum {
  'PENDING' = 'PENDING',
  'INPROGRESS' = 'INPROGRESS',
  'SHIPPED' = 'SHIPPED',
  'COMPLETED' = 'COMPLETED',
  'CANCELLED' = 'CANCELLED',
  'REFUNDED' = 'REFUNDED',
}

export const orderStatusEnumSchema = pgEnum(
  'order_status',
  enumToPgEnum(orderStatusEnum)
);

export const orders = pgTable('order', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  couponId: text('coupon_id').references(() => coupons.id),
  orderNo: text('order_no').notNull(),
  totalPrice: numeric('total_price', { scale: 2 }).notNull(),
  orderStatus: orderStatusEnumSchema('order_status')
    .default('PENDING')
    .notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const ordersRelations = relations(orders, ({ many, one }) => ({
  orderItems: many(orderItems),
  orderToStores: many(ordersToStore),
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
}));

export const ordersToStore = pgTable(
  'orders_to_store',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    orderId: text('order_id')
      .notNull()
      .references(() => orders.id, { onDelete: 'cascade' }),
    storeId: text('store_id')
      .notNull()
      .references(() => stores.id, { onDelete: 'cascade' }),
    shippingAddressId: text('shipping_address_id')
      .notNull()
      .references(() => addresses.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => ({
    uniqueOrdersToStore: uniqueIndex('order_store_idx').on(
      table.orderId,
      table.storeId
    ),
  })
);

export const ordersToStoreRelations = relations(
  ordersToStore,
  ({ one, many }) => ({
    order: one(orders, {
      fields: [ordersToStore.orderId],
      references: [orders.id],
    }),
    orderItems: many(orderItems),
    store: one(stores, {
      fields: [ordersToStore.storeId],
      references: [stores.id],
    }),
    shipment: one(shipments),
    // coupon: one(coupons),
    shippingAddress: one(addresses, {
      fields: [ordersToStore.shippingAddressId],
      references: [addresses.id],
    }),
  })
);

export const orderItems = pgTable('order_item', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  orderId: text('order_id')
    .notNull()
    .references(() => orders.id, { onDelete: 'cascade' }),
  ordersToStoreId: text('order_store_id')
    .notNull()
    .references(() => ordersToStore.id, { onDelete: 'cascade' }),
  productId: text('product_id')
    .notNull()
    .references(() => products.id, { onDelete: 'cascade' }),
  quantity: integer('quantity').notNull(),
  price: numeric('price', { scale: 2 }).notNull(),
  selectedAttributes: json('selected_attributes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  ordersToStore: one(ordersToStore, {
    fields: [orderItems.ordersToStoreId],
    references: [ordersToStore.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));
