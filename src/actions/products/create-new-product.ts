'use server';

import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { getStoreByUserId } from '@/lib/services/store';
import { generateSlug } from '@/utils/helpers';
import { createEditNewProductSchema } from '@/lib/validation/store';
import { productsTablePath } from '@/utils/paths';
import { revalidatePath } from 'next/cache';
import * as schema from '@/lib/schema';

type createNewProductFormState = {
  errors?: {
    name?: string[];
    description?: string[];
    summary?: string[];
    price?: string[];
    stock?: string[];
    brand?: string[];
    image?: string[];
    categories?: string[];
    attributes?: string[];
    _form?: string[];
  };
  success?: { message?: string };
};

type AdditionalStatesType = {
  images: string[];
  categories: { catId: string; catName: string; catSlug: string }[];
  attributes: { attributeCategoryId: string; value: string }[];
};

const createNewProduct = async (
  additionalStates: AdditionalStatesType,
  formState: createNewProductFormState,
  formData: FormData
): Promise<createNewProductFormState> => {
  const validatedFields = createEditNewProductSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
    summary: formData.get('summary'),
    price: formData.get('price'),
    stock: Number(formData.get('stock')),
    brand: formData.get('brand'),
    images: additionalStates.images,
    categories: additionalStates.categories,
    attributes: additionalStates.attributes,
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

  const store = await getStoreByUserId(session.user.id);

  if (!store || !store.id) {
    return {
      errors: {
        _form: ['Store not found.'],
      },
    };
  }

  const { images, categories, attributes, ...productFields } =
    validatedFields.data;

  if (categories.length < 0) {
    return {
      errors: {
        _form: ['Category or subcategory not found.'],
      },
    };
  }

  const slug = generateSlug(productFields.name);
  let product: schema.TProduct[];

  try {
    product = await db
      .insert(schema.products)
      .values({
        ...productFields,
        storeId: store.id,
        slug: slug,
        price: String(productFields.price),
      })
      .returning();
    await db.insert(schema.productImages).values(
      images.map((img, ind) => ({
        url: img,
        productId: product[0].id,
        sequence: ind,
      }))
    );
    const newCategories = await db
      .insert(schema.categories)
      .values(
        categories.map((c) => ({
          name: c.catName,
          slug: c.catSlug,
          description: '',
        }))
      )
      .returning();
    await db.insert(schema.categoryToProductMap).values(
      newCategories?.map((c) => ({
        categoryId: c.id,
        productId: product[0].id,
      }))
    );
    await db.insert(schema.productAttributes).values(
      attributes.map((c) => ({
        value: c.value,
        attributeCategoryId: c.attributeCategoryId,
        productId: product[0].id,
      }))
    );
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

  revalidatePath(productsTablePath);

  return {
    success: {
      message: 'Product successfully been created.',
    },
  };
};

export default createNewProduct;
