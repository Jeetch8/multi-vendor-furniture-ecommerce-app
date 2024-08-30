import {
  pgTable,
  text,
  timestamp,
  boolean,
  uniqueIndex,
  pgEnum,
  primaryKey,
  integer,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';
import { stores } from '../schema';
import { productImages } from '../schema';
import { orders } from './order.schema';
import { addresses } from './address.schema';
import { reviews } from './review.schema';
import { favorites } from './favorites.schema';
import { carts } from './cart.schema';
import { searchHistory } from './searchHistory.schema';
import type { AdapterAccountType } from 'next-auth/adapters';

export const userRoleEnum = pgEnum('user_role', [
  'ADMIN',
  'USER',
  'STORE_OWNER',
]);

export const users = pgTable('user', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text('name').notNull(),
  username: text('username').unique(),
  email: text('email').unique().notNull(),
  banner_img: text('banner_img'),
  image: text('image'),
  password: text('password'),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  isTwoFactorEnabled: boolean('is_two_factor_enabled').default(false),
  role: userRoleEnum('role').default('USER'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const usersRelations = relations(users, ({ many, one }) => ({
  accounts: many(accounts),
  addresses: many(addresses),
  store: one(stores, {
    fields: [users.id],
    references: [stores.userId],
  }),
  images: many(productImages),
  orders: many(orders),
  reviews: many(reviews),
  favorites: many(favorites),
  cart: one(carts, {
    fields: [users.id],
    references: [carts.userId],
  }),
  searchHistories: many(searchHistory),
}));
export const accounts = pgTable(
  'account',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccountType>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = pgTable('session', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export const verificationTokens = pgTable(
  'verificationToken',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  })
);

export const authenticators = pgTable(
  'authenticator',
  {
    credentialID: text('credentialID').notNull().unique(),
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    providerAccountId: text('providerAccountId').notNull(),
    credentialPublicKey: text('credentialPublicKey').notNull(),
    counter: integer('counter').notNull(),
    credentialDeviceType: text('credentialDeviceType').notNull(),
    credentialBackedUp: boolean('credentialBackedUp').notNull(),
    transports: text('transports'),
  },
  (authenticator) => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  })
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const passwordResetTokens = pgTable(
  'passwordresettoken',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    email: text('email').notNull(),
    token: text('token').unique().notNull(),
    expires: timestamp('expires').notNull(),
  },
  (table) => ({
    psswordResetEmailTokenIdx: uniqueIndex('password_reset_email_token_idx').on(
      table.email,
      table.token
    ),
  })
);

export const twoFactorTokens = pgTable(
  'two_factor_token',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    email: text('email').notNull(),
    token: text('token').unique().notNull(),
    expires: timestamp('expires').notNull(),
  },
  (table) => ({
    twoFactorEmailTokenIdx: uniqueIndex('two_factor_email_token_idx').on(
      table.email,
      table.token
    ),
  })
);

export const twoFactorConfirmations = pgTable('two_factor_confirmation', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: text('user_id')
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: 'cascade' }),
});

export const twoFactorConfirmationsRelations = relations(
  twoFactorConfirmations,
  ({ one }) => ({
    user: one(users, {
      fields: [twoFactorConfirmations.userId],
      references: [users.id],
    }),
  })
);
