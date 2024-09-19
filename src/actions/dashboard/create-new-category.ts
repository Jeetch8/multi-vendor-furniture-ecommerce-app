'use server';

import { db } from '@/lib/db';
import * as schema from '@/lib/schema';
import { generateSlug } from '@/utils/helpers';
import { createNewCategorySchema } from '@/lib/validation/category';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { and, eq } from 'drizzle-orm';
import { categoriesListPath } from '@/utils/paths';

export type Attribute = {
  name: string;
  type: string;
  required: string;
  options: string;
};

type createNewProductFormState = {
  errors?: {
    name?: string[];
    description?: string[];
    _form?: string[];
  };
  success?: { message?: string };
};

type AdditionalStatesType = {
  attributes?: Attribute[];
  categories?: { catId: string; catName: string; catSlug: string }[];
};

const createNewCategory = async (
  additionalStates: AdditionalStatesType,
  formState: createNewProductFormState,
  formData: FormData
): Promise<createNewProductFormState> => {
  const validatedFields = createNewCategorySchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
    attributes: additionalStates.attributes,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  const session = await auth();
  const user = session?.user;
  const role = user?.role;

  if (!user || !user.id || !user.role) {
    return {
      errors: {
        _form: ['You must be signed in to do this.'],
      },
    };
  }

  if (role !== 'ADMIN') {
    return {
      errors: {
        _form: ['You must be signed in to do this.'],
      },
    };
  }

  try {
    // const newCategory = await db.category.create({
    //   data: {
    //     parent_id: additionalStates.categories?.length
    //       ? additionalStates.categories[additionalStates.categories.length - 1]
    //           .catId
    //       : null,
    //     name: validatedFields.data.name,
    //     slug: generateSlug(validatedFields.data.name),
    //     description: validatedFields.data.description,
    //   },
    // });
    const newCategory = (
      await db
        .insert(schema.categories)
        .values({
          parentId: additionalStates.categories?.length
            ? additionalStates.categories[
                additionalStates.categories.length - 1
              ].catId
            : null,
          name: validatedFields.data.name,
          slug: generateSlug(validatedFields.data.name),
          description: validatedFields.data.description,
        })
        .returning()
    )[0];
    if (additionalStates.categories)
      additionalStates.categories.push({
        catId: newCategory.id,
        catName: newCategory.name,
        catSlug: newCategory.slug,
      });

    if (additionalStates.attributes && additionalStates.categories) {
      for (const attr of additionalStates.attributes) {
        // let categoryAttribute = await db.categoryAttribute.findFirst({
        //   where: {
        //     name: attr.name,
        //     type: attr.type,
        //   },
        // });
        let attributeCategory = await db.query.attributeCategory.findFirst({
          where: and(
            eq(schema.attributeCategory.name, attr.name),
            eq(schema.attributeCategory.type, attr.type)
          ),
        });

        if (attributeCategory) {
          if (attr.type === 'multi-select') {
            const existingOptions = new Set(
              attributeCategory.options?.split(',') || []
            );
            const newOptions = attr.options.split(',');

            newOptions.forEach((option) => existingOptions.add(option.trim()));

            const mergedOptions = Array.from(existingOptions).join(',');

            // attributeCategory = await db.categoryAttribute.update({
            //   where: { id: categoryAttribute.id },
            //   data: { options: mergedOptions },
            // });
            attributeCategory = (
              await db
                .update(schema.attributeCategory)
                .set({
                  options: mergedOptions,
                })
                .where(eq(schema.attributeCategory.id, attributeCategory.id))
                .returning()
            )[0];
          }
        } else {
          // categoryAttribute = await db.categoryAttribute.create({
          //   data: {
          //     name: attr.name,
          //     type: attr.type,
          //     required: attr.required === 'yes',
          //     options: attr.options,
          //   },
          // });
          attributeCategory = (
            await db
              .insert(schema.attributeCategory)
              .values({
                name: attr.name,
                type: attr.type,
                required: attr.required === 'yes',
                options: attr.options,
              })
              .returning()
          )[0];
        }

        for (const cat of additionalStates.categories) {
          // const existingRelation =
          //   await db.categoryAttributeRelation.findUnique({
          //     where: {
          //       category_id_category_attribute_id: {
          //         category_id: cat.catId,
          //         category_attribute_id: categoryAttribute.id,
          //       },
          //     },
          //   });
          const existingRelation =
            await db.query.categoryToAttributeCategoryMap.findFirst({
              where: and(
                eq(schema.categoryToAttributeCategoryMap.categoryId, cat.catId),
                eq(
                  schema.categoryToAttributeCategoryMap.attributeCategoryId,
                  attributeCategory.id
                )
              ),
            });

          if (!existingRelation) {
            // await db.categoryAttributeRelation.create({
            //   data: {
            //     category_id: cat.catId,
            //     category_attribute_id: categoryAttribute.id,
            //   },
            // });
            await db.insert(schema.categoryToAttributeCategoryMap).values({
              categoryId: cat.catId,
              attributeCategoryId: attributeCategory.id,
            });
          }
        }
      }
    }
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

  revalidatePath(categoriesListPath);

  return {
    success: { message: 'Category created successfully' },
  };
};

export default createNewCategory;
