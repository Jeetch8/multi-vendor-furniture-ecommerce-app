import { integer, text, boolean, uniqueIndex } from 'drizzle-orm/pg-core';
import { pgTable, timestamp } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';
import { categories, orderItems, stores } from '../schema';
import { relations } from 'drizzle-orm';
import { attributeCategory, categoryToProductMap } from './category.schema';
import { discounts } from './discount.schema';
import { favorites } from './favorites.schema';
import { reviews } from './review.schema';

export const products = pgTable(
  'product',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    storeId: text('store_id')
      .notNull()
      .references(() => stores.id, { onDelete: 'cascade' }),
    discountId: text('discount_id')
      .references(() => discounts.id)
      .unique(),
    name: text('name').notNull(),
    description: text('description').notNull(),
    summary: text('summary').notNull(),
    price: integer('price').notNull(),
    stock: integer('stock').notNull(),
    slug: text('product_slug').notNull(),
    status: boolean('status').default(false),
    brand: text('brand').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => ({
    storeNameIdx: uniqueIndex('store_name_idx').on(table.storeId, table.name),
    productSlugIdx: uniqueIndex('product_slug_idx').on(table.slug),
  })
);

export const productsRelations = relations(products, ({ many, one }) => ({
  images: many(productImages),
  attributes: many(productAttributes),
  categoryToProducts: one(categoryToProductMap, {
    fields: [products.id],
    references: [categoryToProductMap.productId],
  }),
  favorites: many(favorites),
  reviews: many(reviews),
  store: one(stores, {
    fields: [products.storeId],
    references: [stores.id],
  }),
  discount: one(discounts, {
    fields: [products.discountId],
    references: [discounts.id],
  }),
  orderItems: many(orderItems),
}));

export const productImages = pgTable(
  'product_image',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    productId: text('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    sequence: integer('sequence').notNull(),
    url: text('url').notNull(),
    smUrl: text('sm_url'),
    thumbUrl: text('thumb_url'),
    alt: text('alt'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => ({
    productIdUrlIdx: uniqueIndex('product_id_url_idx').on(
      table.productId,
      table.url
    ),
  })
);

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}));

export const productCategoryMappingRelations = relations(
  categoryToProductMap,
  ({ one }) => ({
    product: one(products, {
      fields: [categoryToProductMap.productId],
      references: [products.id],
    }),
    category: one(categories, {
      fields: [categoryToProductMap.categoryId],
      references: [categories.id],
    }),
  })
);

export const productAttributes = pgTable(
  'product_attribute',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    productId: text('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    attributeCategoryId: text('attribute_category_id')
      .notNull()
      .references(() => attributeCategory.id),
    value: text('value').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => ({
    uniqueAttr: uniqueIndex('product_category_attr_idx').on(
      table.productId,
      table.attributeCategoryId,
      table.value
    ),
  })
);

export const productAttributesRelations = relations(
  productAttributes,
  ({ one }) => ({
    product: one(products, {
      fields: [productAttributes.productId],
      references: [products.id],
    }),
    attributeCategory: one(attributeCategory, {
      fields: [productAttributes.attributeCategoryId],
      references: [attributeCategory.id],
    }),
  })
);
