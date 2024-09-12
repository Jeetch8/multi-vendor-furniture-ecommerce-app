import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  numeric,
} from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';
import { stores } from './store.schema';
import { relations } from 'drizzle-orm';
import { orders } from './order.schema';

export const coupons = pgTable('coupon', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  storeId: text('store_id')
    .notNull()
    .references(() => stores.id),
  code: text('code').notNull().unique(),
  description: text('description'),
  discountAmount: numeric('discount_amount', { scale: 2 }).notNull(),
  usesCount: integer('uses_count').notNull(),
  active: boolean('active').default(true),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const couponsRelations = relations(coupons, ({ one, many }) => ({
  store: one(stores, {
    fields: [coupons.storeId],
    references: [stores.id],
  }),
  order: many(orders),
}));
