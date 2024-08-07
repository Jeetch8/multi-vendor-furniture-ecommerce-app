import {
  pgTable,
  text,
  timestamp,
  boolean,
  primaryKey,
  index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';
import { shipments, shippingRates } from './shipment.schema';
import { stores } from './store.schema';

export const carriers = pgTable('carrier', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text('name').notNull().unique(),
  code: text('code').notNull().unique(),
  trackingUrl: text('tracking_url'),
  logoUrl: text('logo_url'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const carriersRelations = relations(carriers, ({ many }) => ({
  shipments: many(shipments),
  shippingRates: many(shippingRates),
  storeToCarriers: many(storeToCarriers),
}));

export const storeToCarriers = pgTable(
  'store_to_carrier',
  {
    storeId: text('store_id')
      .notNull()
      .references(() => stores.id, { onDelete: 'cascade' }),
    carrierId: text('carrier_id')
      .notNull()
      .references(() => carriers.id, { onDelete: 'cascade' }),
    isActive: boolean('is_active').default(true),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.storeId, table.carrierId] }),
    carrierIdx: index('carrier_idx').on(table.carrierId),
  })
);

export const storeToCarriersRelations = relations(
  storeToCarriers,
  ({ one }) => ({
    carrier: one(carriers, {
      fields: [storeToCarriers.carrierId],
      references: [carriers.id],
    }),
    store: one(stores, {
      fields: [storeToCarriers.storeId],
      references: [stores.id],
    }),
  })
);
