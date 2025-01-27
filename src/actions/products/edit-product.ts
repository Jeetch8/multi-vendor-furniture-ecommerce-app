'use server';

import * as schema from '@/lib/schema';
import { db } from '@/lib/db';
import { fetchProductsByStoreId } from '@/lib/services/product';
import { createEditNewProductSchema } from '@/lib/validation/store';
import { auth } from '@/lib/auth';
import { generateSlug } from '@/utils/helpers';
import { productsListPath } from '@/utils/paths';
import { productsTablePath } from '@/utils/paths';
import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';

type editProductFormState = {
  errors?: {
    name?: string[];
    description?: string[];
    summary?: string[];
    price?: string[];
    stock?: string[];
    brand?: string[];
    image?: string[];
    category?: string[];
    attributes?: string[];
    _form?: string[];
  };
  success?: { message?: string };
};

type AdditionalStatesType = {
  images: string[];
  categories: { catId: string; catName: string; catSlug: string }[];
  attributes: { attributeCategoryId: string; value: string }[];
  productId: string;
};

const editProduct = async (
  additionalStates: AdditionalStatesType,
  formState: editProductFormState,
  formData: FormData
): Promise<editProductFormState> => {
  const validatedFields = createEditNewProductSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
    summary: formData.get('summary'),
    price: Number(formData.get('price')),
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
  const user = session?.user;
  if (!user || !user.id) {
    return {
      errors: {
        _form: ['You must be signed in to do this.'],
      },
    };
  }

  if (!user.store || !user.store.id) {
    return {
      errors: {
        _form: ['Store not found.'],
      },
    };
  }

  const { products } = await fetchProductsByStoreId({
    storeId: user.store.id,
  });

  const productIds = products?.map((product: any) => product.id);

  if (!productIds?.includes(additionalStates.productId)) {
    return {
      errors: {
        _form: ['You are not allowed to do that'],
      },
    };
  }

  const { images, categories, attributes, ...restFields } =
    validatedFields.data;

  const slug = generateSlug(restFields.name);

  const productData: typeof schema.products.$inferInsert = {
    ...restFields,
    slug,
    price: String(restFields.price),
    storeId: user.store.id,
    tags: '',
  };

  let updatedProduct;
  try {
    updatedProduct = (
      await db
        .update(schema.products)
        .set(productData)
        .where(eq(schema.products.id, additionalStates.productId))
        .returning()
    )[0];
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
          _form: ['Something went wrong'],
        },
      };
    }
  }

  const newProductImages = images.map((img, ind) => ({
    productId: updatedProduct.id,
    url: img,
    sequence: ind,
  }));

  try {
    const existingUrls = await db.query.productImages.findMany({
      where: eq(schema.productImages.productId, updatedProduct.id),
      columns: {
        url: true,
        productId: true,
        sequence: true,
      },
    });

    const existingUrlsSet = new Set(existingUrls.map((img) => img.url));

    const imagesToAdd = newProductImages.filter(
      (img) => !existingUrlsSet.has(img.url)
    );

    if (imagesToAdd.length > 0) {
      await db.insert(schema.productImages).values(imagesToAdd);
    }
    await db.insert(schema.categoryToProductMap).values(
      categories.map((cat) => ({
        categoryId: cat.catId,
        productId: updatedProduct.id,
      }))
    );
    await db.insert(schema.productAttributes).values(
      attributes.map((att) => ({
        value: att.value,
        attributeCategoryId: att.attributeCategoryId,
        productId: updatedProduct.id,
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
  revalidatePath(productsListPath);

  return {
    success: { message: 'Product successfully been edited' },
  };
};

export default editProduct;
