'use server';

import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { createNewCarrierSchema } from '@/lib/validation/store';
import * as schema from '@/lib/schema';

type CreateNewCarrier = {
  errors?: {
    name?: string[];
    code?: string[];
    url?: string[];
    shipping_rate_name?: string[];
    shipping_rate_description?: string[];
    base_rate?: string[];
    per_kg_rate?: string[];
    min_weight?: string[];
    max_weight?: string[];
    _form?: string[];
  };
  success?: { message: string };
};

export default async function createNewCarrier(
  formState: CreateNewCarrier,
  formData: FormData
): Promise<CreateNewCarrier> {
  const validatedFields = createNewCarrierSchema.safeParse({
    name: formData.get('name'),
    code: formData.get('code'),
    url: formData.get('url'),
    shipping_rate_name: formData.get('shipping_rate_name'),
    shipping_rate_description: formData.get('shipping_rate_description'),
    base_rate: formData.get('base_rate'),
    per_kg_rate: formData.get('per_kg_rate'),
    min_weight: formData.get('min_weight'),
    max_weight: formData.get('max_weight'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  const session = await auth();
  const user = session?.user;
  const store = user?.store;

  if (!user || !user?.id) {
    return {
      errors: {
        _form: ['You must be signed in to do this.'],
      },
    };
  }

  if (!store || !store.id) {
    return {
      errors: {
        _form: ['Store not found.'],
      },
    };
  }

  const { name, code, url } = validatedFields.data;

  const carrierData: typeof schema.carriers.$inferInsert = {
    name,
    code,
  };

  if (url) {
    carrierData.logoUrl = url;
  }

  const {
    shipping_rate_name,
    shipping_rate_description,
    base_rate,
    per_kg_rate,
    min_weight,
    max_weight,
  } = validatedFields.data;

  try {
    const newCarrier = await db
      .insert(schema.carriers)
      .values(carrierData)
      .returning();

    await db.insert(schema.storeToCarriers).values({
      storeId: store.id,
      carrierId: newCarrier[0].id,
    });

    const shippingRateData: typeof schema.shippingRates.$inferInsert = {
      name: shipping_rate_name,
      baseRate: String(base_rate),
      perKgRate: String(per_kg_rate),
      minWeight: String(min_weight),
      maxWeight: String(max_weight),
      carrierId: newCarrier[0].id,
    };

    if (shipping_rate_description) {
      shippingRateData.description = shipping_rate_description;
    }

    await db.insert(schema.shippingRates).values(shippingRateData);
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

  return {
    success: {
      message: 'Carrier successfully been added.',
    },
  };
}
