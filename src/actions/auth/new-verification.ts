'use server';

import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { getVerificationTokenByToken } from '@/lib/services/token';
import { getUserByEmail } from '@/lib/services/user';
import * as schema from '@/lib/schema';
import { eq } from 'drizzle-orm';

const newVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    return { errors: { _form: ['Token does not exist!'] } };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { errors: { _form: ['Token has expired!'] } };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { errors: { _form: ['Email does not exist!'] } };
  }

  await db
    .update(schema.users)
    .set({
      emailVerified: new Date(),
      email: existingToken.email,
    })
    .where(eq(schema.users.id, existingUser.id));

  await db
    .delete(schema.verificationTokens)
    .where(eq(schema.verificationTokens.id, existingToken.id));

  return { success: { message: 'Email verified.' } };
};

export default newVerification;
