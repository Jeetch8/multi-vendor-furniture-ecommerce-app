import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  numeric,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';
import { stores } from './store.schema';
import { products } from './product.schema';
import { categories } from './category.schema';

export const discounts = pgTable('discount', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  storeId: text('store_id')
    .notNull()
    .references(() => stores.id),
  name: text('name').notNull(),
  description: text('description'),
  discountPercent: numeric('discount_percent', { scale: 2 }).notNull(),
  active: boolean('active').default(true),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date'),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const discountsRelations = relations(discounts, ({ many, one }) => ({
  store: one(stores, {
    fields: [discounts.storeId],
    references: [stores.id],
  }),
  products: many(products),
  categories: many(categories),
}));
