import { pgTable, text, timestamp, boolean } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';
import { coupons, discounts, products, users } from '../schema';
import { relations } from 'drizzle-orm';
import { ordersToStore } from './order.schema';
import { storeToCarriers } from './carrier.schema';

export const stores = pgTable('store', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' })
    .unique(),
  storeName: text('store_name').notNull(),
  slug: text('store_slug').notNull().unique(),
  description: text('description').notNull(),
  img: text('img').notNull(),
  address: text('address').notNull(),
  cellPhone: text('cell_phone').notNull(),
  isVerified: boolean('is_verified').default(false),
  isActive: boolean('is_active').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const storeRelations = relations(stores, ({ many, one }) => ({
  owner: one(users, {
    fields: [stores.userId],
    references: [users.id],
  }),
  coupons: many(coupons),
  discounts: many(discounts),
  products: many(products),
  ordersToStore: many(ordersToStore),
  storeToCarriers: many(storeToCarriers),
}));
