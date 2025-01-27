import { pgTable, text, timestamp, numeric, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';
import { ordersToStore } from './order.schema';
import { carriers } from './carrier.schema';
import { enumToPgEnum } from '../utils';

export enum shipmentStatusEnum {
  'PENDING' = 'PENDING',
  'PROCESSING' = 'PROCESSING',
  'SHIPPED' = 'SHIPPED',
  'IN_TRANSIT' = 'IN_TRANSIT',
  'DELIVERED' = 'DELIVERED',
  'RETURNED' = 'RETURNED',
  'FAILED' = 'FAILED',
}

export const shipmentStatusEnumSchema = pgEnum(
  'shipment_status',
  enumToPgEnum(shipmentStatusEnum)
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
  status: shipmentStatusEnumSchema('status').default('PENDING'),
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
