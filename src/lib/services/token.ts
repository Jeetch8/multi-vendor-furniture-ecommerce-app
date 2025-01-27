import { db } from '../db';
import { passwordResetTokens } from '../schema';
import { eq } from 'drizzle-orm';
import * as schema from '@/lib/schema';
import { createId } from '@paralleldrive/cuid2';
import crypto from 'crypto';

export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    const passwordResetToken = await db.query.passwordResetTokens.findFirst({
      where: eq(passwordResetTokens.token, token),
    });

    return passwordResetToken;
  } catch {
    null;
  }
};

export const getVerificationTokenByToken = async (token: string) => {
  try {
    const res = await db.query.verificationTokens.findFirst({
      where: eq(schema.verificationTokens.token, token),
    });

    return res;
  } catch {
    return null;
  }
};

export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    const passwordResetToken = await db.query.passwordResetTokens.findFirst({
      where: eq(passwordResetTokens.email, email),
    });

    return passwordResetToken;
  } catch {
    null;
  }
};

export const generatePasswordResetToken = async (email: string) => {
  const token = createId();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getPasswordResetTokenByEmail(email);

  if (existingToken) {
    await db
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.id, existingToken.id));
  }

  const passwordResetToken = await db
    .insert(passwordResetTokens)
    .values({
      email,
      token,
      expires,
    })
    .returning();

  return passwordResetToken[0];
};

export const getVerificationTokenByEMail = async (email: string) => {
  try {
    const res = await db.query.verificationTokens.findFirst({
      where: eq(schema.verificationTokens, email),
    });

    return res;
  } catch {
    return null;
  }
};

export const generateVerificationToken = async (email: string) => {
  const token = createId();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getVerificationTokenByEMail(email);

  if (existingToken) {
    await db
      .delete(schema.verificationTokens)
      .where(
        eq(schema.verificationTokens.identifier, existingToken.identifier)
      );
  }

  const verificationToken = await db
    .insert(schema.verificationTokens)
    .values({
      identifier: email,
      token,
      expires,
    })
    .returning();
  return verificationToken[0];
};

export const getTwoFactorTokenByEmail = async (email: string) => {
  try {
    const twoFactorToken = await db.query.twoFactorTokens.findFirst({
      where: eq(schema.twoFactorTokens.email, email),
    });

    return twoFactorToken;
  } catch {
    return null;
  }
};

export const generateTwoFactorToken = async (email: string) => {
  const token = crypto.randomInt(100_000, 1_000_000).toString();
  const expires = new Date(new Date().getTime() + 60 * 1000);

  const existingToken = await getTwoFactorTokenByEmail(email);

  if (existingToken) {
    await db
      .delete(schema.twoFactorTokens)
      .where(eq(schema.twoFactorTokens.id, existingToken.id));
  }
  const twoFactorToken = await db
    .insert(schema.twoFactorTokens)
    .values({
      email,
      token,
      expires,
    })
    .returning();
  return { twoFactorToken: twoFactorToken[0], expires };
};
