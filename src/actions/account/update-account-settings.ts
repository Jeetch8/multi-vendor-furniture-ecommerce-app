'use server';

import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { updateAccountSettingsSchema } from '@/lib/validation/account';
import * as schema from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { myAccountSettingsPath } from '@/utils/paths';

type updateAccountSettingsFormState = {
  errors?: {
    email?: string[];
    name?: string[];
    password?: string[];
    isTwoFactorEnabled?: string[];
    _form?: string[];
  };
  success?: { message?: string };
};

type AdditionalStatesType = {
  userId: string;
};

const updateAccountSettings = async (
  additionalStates: AdditionalStatesType,
  formState: updateAccountSettingsFormState,
  formData: FormData
): Promise<updateAccountSettingsFormState> => {
  const email = formData.get('email') as string | null;
  const name = formData.get('name') as string | null;
  const password = formData.get('password') as string | null;
  const isTwoFactorEnabled = formData.get('switchState');

  const processedData = {
    email: email && email.trim() !== '' ? email : undefined,
    name: name && name.trim() !== '' ? name : undefined,
    password: password && password.trim() !== '' ? password : undefined,
    isTwoFactorEnabled,
  };

  const validatedFields = updateAccountSettingsSchema.safeParse(processedData);

  const session = await auth();
  const user = session?.user;

  if (!user || !user.id) {
    return {
      errors: {
        _form: ['You must be signed in to do this.'],
      },
    };
  }

  if (user.id !== additionalStates.userId) {
    return {
      errors: {
        _form: ['You do not have a permission to do that.'],
      },
    };
  }

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const {
    name: vName,
    email: vEmail,
    password: vPassword,
    isTwoFactorEnabled: vIsTwoFactorEnabled,
  } = validatedFields.data;

  if (vName === undefined || vEmail === undefined) {
    return {
      errors: {
        _form: ['Name and email are required.'],
      },
    };
  }

  const updateData: typeof schema.users.$inferInsert = {
    name: vName,
    email: vEmail,
    isTwoFactorEnabled: vIsTwoFactorEnabled === 'true' ? true : false,
  };

  if (vPassword) {
    const hashedPassword = await bcrypt.hash(vPassword, 10);
    updateData.password = hashedPassword;
  }
  if (vName !== undefined) updateData.name = vName;
  if (vEmail !== undefined) updateData.email = vEmail;

  try {
    await db
      .update(schema.users)
      .set({
        ...updateData,
        isTwoFactorEnabled: vIsTwoFactorEnabled === 'true' ? true : false,
      })
      .where(eq(schema.users.id, user.id));
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        errors: {
          _form: [err.message],
        },
      };
    } else {
      return {
        errors: {
          _form: ['Something went wrong'],
        },
      };
    }
  }

  revalidatePath(myAccountSettingsPath);

  return {
    success: { message: 'Account settings have been successfully updated.' },
  };
};

export default updateAccountSettings;
