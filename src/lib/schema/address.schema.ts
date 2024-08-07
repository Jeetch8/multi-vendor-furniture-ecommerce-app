import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';
import { users } from './user.schema';

export const addresses = pgTable('address', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  addressLine1: text('address_line_1').notNull(),
  addressLine2: text('address_line_2').notNull(),
  country: text('country').notNull(),
  city: text('city').notNull(),
  postalCode: text('postal_code').notNull(),
  landmark: text('landmark').notNull(),
  phoneNumber: text('phone_number').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const addressesRelations = relations(addresses, ({ one }) => ({
  user: one(users, {
    fields: [addresses.userId],
    references: [users.id],
  }),
}));
