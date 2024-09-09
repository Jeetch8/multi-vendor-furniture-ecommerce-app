'use server';

import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { stores, users } from '@/lib/schema';
import { generateSlug } from '@/utils/helpers';
import { newApplicationSchema } from '@/lib/validation/store';
import { eq } from 'drizzle-orm';

type newApplicationFormState = {
  errors?: {
    cellphone?: string[];
    address?: string[];
    storename?: string[];
    description?: string[];
    img?: string[];
    _form?: string[];
  };
  success?: { message?: string };
};

const newApplication = async (
  formState: newApplicationFormState,
  formData: FormData
): Promise<newApplicationFormState> => {
  const validatedFields = newApplicationSchema.safeParse({
    cellphone: formData.get('cellphone'),
    address: formData.get('address'),
    storename: formData.get('storename'),
    description: formData.get('description'),
    img: formData.get('img'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return {
      errors: {
        _form: ['You must be signed in to do this.'],
      },
    };
  }

  const isStoreCreatedByUserAlready = await db.query.stores.findFirst({
    where: eq(stores.userId, session.user.id),
  });

  if (isStoreCreatedByUserAlready) {
    return {
      errors: {
        _form: ['You have already created a shop.'],
      },
    };
  }

  const { storename, description, img, address, cellphone } =
    validatedFields.data;

  try {
    await db.insert(stores).values({
      userId: session.user.id,
      slug: generateSlug(storename),
      storeName: storename,
      description,
      img: img || '',
      address,
      cellPhone: cellphone,
    });
  } catch (err) {
    if (err instanceof Error) {
      return {
        errors: {
          _form: [err.message],
        },
      };
    } else {
      return {
        errors: {
          _form: ['Failed to create post'],
        },
      };
    }
  }

  // changing role

  await db
    .update(users)
    .set({ role: 'STORE_OWNER' })
    .where(eq(users.id, session.user.id));

  return {
    success: {
      message: 'Your shop has been successfully created.',
    },
  };
};

export default newApplication;
