import { db } from '@/lib/db';
import { and, eq, ilike, sql } from 'drizzle-orm';
import * as schema from '@/lib/schema';

export const getTopSellingCategoriesByStore = async (storeId: string) => {
  const productsQr = await db.query.products.findMany({
    where: eq(schema.products.storeId, storeId),
    with: {
      categoryToProducts: {
        with: {
          category: true,
        },
      },
      orderItems: true,
    },
  });
  const categoryQuantityObj: Record<string, number> = {};
  productsQr.forEach((product) => {
    product.categoryToProducts.forEach(({ category }) => {
      if (categoryQuantityObj[category.name]) {
        categoryQuantityObj[category.name]++;
      } else {
        categoryQuantityObj[category.name] = 1;
      }
    });
  });
  const categoryArr = Object.entries(categoryQuantityObj).map(
    ([categoryId, quantity]) => ({
      categoryId,
      quantity,
    })
  );
  const sortedCategoryArr = categoryArr.sort((a, b) => b.quantity - a.quantity);
  return sortedCategoryArr.slice(0, 5);
};

export async function fetchCategories(term?: string) {
  try {
    // const whereArr = [eq(schema.categories.isActive, true)];
    // const query = db
    //   .select()
    //   .from(schema.categories)
    //   .where(and(...whereArr))
    //   .leftJoin(
    //     schema.products,
    //     eq(schema.categories.parentId, schema.categories.id)
    //   )
    //   .leftJoin(schema.stores, eq(schema.products.storeId, schema.stores.id))
    //   .leftJoin(
    //     schema.productAttributes,
    //     eq(schema.products.id, schema.productAttributes.productId)
    //   )
    //   .leftJoin(
    //     schema.categoryToProductMap,
    //     eq(schema.categoryToProductMap.categoryId, schema.categories.id)
    //   )
    //   .leftJoin(
    //     schema.attributeCategory,
    //     eq(schema.categoryToProductMap.categoryId, schema.attributeCategory.id)
    //   );
    // if (term && term !== 'all') {
    //   whereArr.push(eq(schema.categories.name, term));
    // }
    // const res = await query;

    // return res;

    const query = await db.query.categories.findMany({
      where: and(
        term && term !== 'all'
          ? ilike(schema.categories.name, `%${term}%`)
          : undefined
      ),
      with: {
        subCategories: {
          with: {
            products: true,
          },
        },
        products: true,
        categoryToAttributeCategory: {
          with: {
            attributeCategory: {
              with: {
                productAttributes: true,
              },
            },
          },
        },
      },
    });
    return query;
  } catch {
    throw new Error("Couldn't fetch categories");
  }
}

export const fetchCategoryBySlug = async (slug: string) => {
  const query = await db.query.categories.findFirst({
    where: and(
      // eq(schema.categories.isActive, true),
      ilike(schema.categories.slug, `%${slug}%`)
    ),
    with: {
      subCategories: {
        with: {
          products: {
            columns: {
              id: true,
            },
          },
        },
      },
      products: {
        columns: {
          id: true,
        },
        // with: {
        //   product: {
        //     with: {
        //       store: true,
        //     },
        //   },
        // },
      },
      categoryToAttributeCategory: {
        with: {
          attributeCategory: {
            with: {
              productAttributes: true,
            },
          },
        },
      },
    },
  });
  return query;
};
