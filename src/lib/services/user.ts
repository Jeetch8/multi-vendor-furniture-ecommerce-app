import { eq } from 'drizzle-orm';
import { db } from '../db';
import { accounts, twoFactorConfirmations, users } from '../schema';
import { PgTransaction } from 'drizzle-orm/pg-core';

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    return user;
  } catch {
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
      with: { store: true, cart: true },
    });

    return user;
  } catch {
    return null;
  }
};

export const getTwoFactorConfirmationByUserId = async (user_id: string) => {
  try {
    const twoFactorConfirmation =
      await db.query.twoFactorConfirmations.findFirst({
        where: eq(twoFactorConfirmations.userId, user_id),
      });

    return twoFactorConfirmation;
  } catch {
    return null;
  }
};

export const createUser = async (
  user: typeof users.$inferInsert,
  tx?: PgTransaction<any, any, any>
) => {
  const newUser = await (tx ?? db).insert(users).values(user).returning();
  return newUser;
};

export const createAccount = async (
  account: typeof accounts.$inferInsert,
  tx?: PgTransaction<any, any, any>
) => {
  const newAccount = await (tx ?? db)
    .insert(accounts)
    .values(account)
    .returning();
  return newAccount;
};

export const setUserEmailVerified = async (user_id: string) => {
  await db
    .update(users)
    .set({ emailVerified: new Date() })
    .where(eq(users.id, user_id));
};

export const updateUserPassword = async (
  email: string,
  password: string,
  tx?: PgTransaction<any, any, any>
) => {
  await (tx ?? db)
    .update(users)
    .set({ password })
    .where(eq(users.email, email));
};
