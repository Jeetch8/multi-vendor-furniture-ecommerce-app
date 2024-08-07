import { relations } from 'drizzle-orm';
import { pgTable, timestamp, text, unique } from 'drizzle-orm/pg-core';
import { products } from './product.schema';
import { createId } from '@paralleldrive/cuid2';

export const collections = pgTable('collections', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text('name').notNull(),
  slug: text('slug').notNull(),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const collectionsRelations = relations(collections, ({ many }) => ({
  products: many(collectionsToProductsMap),
}));

export const collectionsToProductsMap = pgTable(
  'collections_to_products_map',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    collectionId: text('collection_id').references(() => collections.id),
    productId: text('product_id').references(() => products.id),
  },
  (t) => ({
    collectionId_productId: unique().on(t.collectionId, t.productId),
  })
);

export const collectionsToProductsMapRelations = relations(
  collectionsToProductsMap,
  ({ one }) => ({
    collection: one(collections, {
      fields: [collectionsToProductsMap.collectionId],
      references: [collections.id],
    }),
    product: one(products, {
      fields: [collectionsToProductsMap.productId],
      references: [products.id],
    }),
  })
);
