import { db } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { accounts, addresses } from '@/lib/schema';
import { PgTransaction } from 'drizzle-orm/pg-core';

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
