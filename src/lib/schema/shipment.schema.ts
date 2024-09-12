import {
  pgTable,
  text,
  timestamp,
  boolean,
  uniqueIndex,
  numeric,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';
import { ordersToStore } from './order.schema';
import { carriers } from './carrier.schema';

export const shipmentStatusEnum = pgEnum('shipment_status', [
  'PENDING',
  'PROCESSING',
  'SHIPPED',
  'IN_TRANSIT',
  'DELIVERED',
  'RETURNED',
  'FAILED',
]);

export const shippingRates = pgTable(
  'shipping_rate',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    carrierId: text('carrier_id')
      .notNull()
      .references(() => carriers.id),
    name: text('name').notNull(),
    description: text('description'),
    baseRate: numeric('base_rate', { scale: 2 }).notNull(),
    perKgRate: numeric('per_kg_rate', { scale: 2 }).notNull(),
    minWeight: numeric('min_weight', { scale: 2 }).notNull(),
    maxWeight: numeric('max_weight', { scale: 2 }).notNull(),
    isActive: boolean('is_active').default(true),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => ({
    carrierNameIdx: uniqueIndex('carrier_name_idx').on(
      table.carrierId,
      table.name
    ),
  })
);

export const shipments = pgTable('shipment', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  orderToStoreId: text('order_store_id')
    .notNull()
    .references(() => ordersToStore.id, { onDelete: 'cascade' })
    .unique(),
  carrierId: text('carrier_id').references(() => carriers.id),
  trackingNumber: text('tracking_number'),
  shippingMethod: text('shipping_method'),
  estimatedDelivery: timestamp('estimated_delivery'),
  actualDelivery: timestamp('actual_delivery'),
  shippingCost: numeric('shipping_cost', { scale: 2 }),
  status: shipmentStatusEnum('status').default('PENDING'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const shipmentsRelations = relations(shipments, ({ one }) => ({
  ordersToStore: one(ordersToStore, {
    fields: [shipments.orderToStoreId],
    references: [ordersToStore.id],
  }),
  carrier: one(carriers, {
    fields: [shipments.carrierId],
    references: [carriers.id],
  }),
}));

export const shippingRatesRelations = relations(shippingRates, ({ one }) => ({
  carrier: one(carriers, {
    fields: [shippingRates.carrierId],
    references: [carriers.id],
  }),
}));
