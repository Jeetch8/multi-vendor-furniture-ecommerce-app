import { pgTable, text, timestamp, boolean, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';
import { productAttributes, products } from './product.schema';
import { discounts } from './discount.schema';

export const categories = pgTable('category', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  discountId: text('discount_id').references(() => discounts.id),
  parentId: text('parent_id'),
  name: text('name').notNull(),
  slug: text('category_slug').notNull().unique(),
  description: text('description').notNull(),
  isActive: boolean('is_active').default(true),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const categoriesRelations = relations(categories, ({ many, one }) => ({
  subCategories: many(categories, { relationName: 'parentChild' }),
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
    relationName: 'parentChild',
  }),
  products: many(categoryToProductMap),
  categoryToAttributeCategory: many(categoryToAttributeCategoryMap),
  discount: one(discounts, {
    fields: [categories.discountId],
    references: [discounts.id],
  }),
}));

export const categoryToAttributeCategoryMap = pgTable(
  'category_to_attribute_category',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    categoryId: text('category_id')
      .notNull()
      .references(() => categories.id, { onDelete: 'cascade' }),
    attributeCategoryId: text('attribute_category_id')
      .notNull()
      .references(() => attributeCategory.id, { onDelete: 'cascade' }),
  },
  (table) => ({
    index: index('category_to_attribute_category_index').on(
      table.categoryId,
      table.attributeCategoryId
    ),
  })
);

export const categoryToAttributeCategoryRelations = relations(
  categoryToAttributeCategoryMap,
  ({ one }) => ({
    category: one(categories, {
      fields: [categoryToAttributeCategoryMap.categoryId],
      references: [categories.id],
    }),
    attributeCategory: one(attributeCategory, {
      fields: [categoryToAttributeCategoryMap.attributeCategoryId],
      references: [attributeCategory.id],
    }),
  })
);

export const attributeCategory = pgTable('attribute_category', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text('name').notNull(),
  type: text('type').notNull(),
  required: boolean('required').default(false),
  options: text('options'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const attributeCategoryRelations = relations(
  attributeCategory,
  ({ many }) => ({
    categoryToAttributeCategory: many(categoryToAttributeCategoryMap),
    productAttributes: many(productAttributes),
  })
);

export const categoryToProductMap = pgTable(
  'category_to_product',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    categoryId: text('category_id')
      .notNull()
      .references(() => categories.id, { onDelete: 'cascade' }),
    productId: text('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
  },
  (table) => ({
    index: index('category_to_product_index').on(
      table.categoryId,
      table.productId
    ),
  })
);

export const categoryToProductRelations = relations(
  categoryToProductMap,
  ({ one }) => ({
    category: one(categories, {
      fields: [categoryToProductMap.categoryId],
      references: [categories.id],
    }),
    product: one(products, {
      fields: [categoryToProductMap.productId],
      references: [products.id],
    }),
  })
);
