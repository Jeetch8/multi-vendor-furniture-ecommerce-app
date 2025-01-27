import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { categories } from './category.schema';

export const rooms = pgTable('room', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text('name').notNull(),
  description: text('description').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const roomRelations = relations(rooms, ({ one }) => ({
  roomToCategory: one(roomToCateogry, {
    fields: [rooms.id],
    references: [roomToCateogry.roomId],
  }),
}));

export const roomToCateogry = pgTable('room_to_category', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  roomId: text('room_id')
    .notNull()
    .references(() => rooms.id, { onDelete: 'cascade' }),
  categoryId: text('category_id').notNull(),
});

export const roomToCategoryRelations = relations(roomToCateogry, ({ one }) => ({
  room: one(rooms, {
    fields: [roomToCateogry.roomId],
    references: [rooms.id],
  }),
  category: one(categories, {
    fields: [roomToCateogry.categoryId],
    references: [categories.id],
  }),
}));
