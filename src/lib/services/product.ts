import { db } from '../db';
import { and, count, eq, gte, ilike, inArray, lte, or, sql } from 'drizzle-orm';
import {
  categories,
  favorites,
  productAttributes,
  products,
  stores,
  TProduct,
  TProductImage,
} from '../schema';
import { TProductForShowPage, TProductsForWithOptions } from '@/types/Product';

export async function fetchProductsForList(
  searchParamsObj: Record<string, string>
): Promise<TProductsForWithOptions | null> {
  const {
    searchQuery,
    minPrice,
    maxPrice,
    sort,
    category,
    page = '1',
    ...filter
  } = searchParamsObj;

  const currentPage = parseInt(page);
  const itemsPerPage = 12;
  const offset = (currentPage - 1) * itemsPerPage;

  try {
    const productsWhereArr: any[] = [eq(products.status, true)];
    const productAttributeWhereArr: any[] = [];
    const categoryIds: string[] = [];
    if (category) {
      const categoriesQr = await db.query.categories.findMany({
        where: inArray(categories.slug, category.split(',')),
      });
      categoryIds.push(...categoriesQr.map((c) => c.id));
    }
    if (searchQuery) {
      productsWhereArr.push(
        ilike(products.name, searchQuery),
        ilike(products.brand, searchQuery)
      );
    }
    if (minPrice || maxPrice) {
      const minPriceNum = Number(minPrice);
      const maxPriceNum = Number(maxPrice);

      if (!isNaN(minPriceNum)) {
        productsWhereArr.push(gte(products.price, String(minPriceNum)));
      }

      if (!isNaN(maxPriceNum)) {
        productsWhereArr.push(lte(products.price, String(maxPriceNum)));
      }
    }

    if (filter) {
      for (const [key, value] of Object.entries(filter)) {
        if (value.split(',').length > 1) {
          productAttributeWhereArr.push(
            inArray(productAttributes.value, value.split(','))
          );
        } else {
          productAttributeWhereArr.push(eq(productAttributes.value, value));
        }
      }
    }
    const productsQr = await db.query.products.findMany({
      where: or(eq(products.status, true), ...productsWhereArr),
      with: {
        attributes: {
          where:
            productAttributeWhereArr.length > 0
              ? or(...productAttributeWhereArr)
              : undefined,
        },
        reviews: true,
        store: true,
        images: true,
        discount: true,
        categoryToProducts: {
          with: {
            category: {
              with: {
                discount: true,
              },
            },
          },
        },
      },
      limit: itemsPerPage,
      offset: offset,
      orderBy(fields, operators) {
        if (sort) {
          const [strField, strOrder] = sort.split('_');
          switch (strField) {
            case 'price':
              if (strOrder === 'asc') {
                return [operators.asc(fields.price)];
              } else {
                return [operators.desc(fields.price)];
              }
            case 'newest':
              return [operators.desc(fields.createdAt)];
            default:
              return [operators.desc(fields.createdAt)];
          }
        }
        return [operators.desc(fields.createdAt)];
      },
    });
    const attributeQuery = await db.query.products.findMany({
      where: searchQuery
        ? or(
            ilike(products.name, `%${searchQuery}%`),
            ilike(products.description, `%${searchQuery}%`)
          )
        : undefined,
      with: {
        categoryToProducts: {
          with: {
            category: {
              with: {
                subCategories: true,
              },
            },
          },
        },
        attributes: {
          with: {
            attributeCategory: true,
          },
        },
      },
    });
    const categoriesForSidebar: Set<string> = new Set();
    const availableAttributes: Record<string, Set<string>> = {};
    let productCount = 0;
    const priceRange = { min: 0, max: 10000 };
    attributeQuery.forEach((product) => {
      productCount++;
      const productPrice = parseFloat(product.price);
      if (productPrice < priceRange.min) {
        priceRange.min = productPrice;
      }
      if (productPrice > priceRange.max) {
        priceRange.max = productPrice;
      }
      const mapTable = product.categoryToProducts;
      mapTable.forEach(({ category }) => {
        if (category.subCategories.length > 0) {
          category.subCategories.forEach((subCategory) => {
            categoriesForSidebar.add(subCategory.name);
          });
        } else {
          categoriesForSidebar.add(category.name);
        }
      });
      product.attributes.forEach((attribute) => {
        const attributeValues =
          attribute.attributeCategory.type === 'multi-select'
            ? attribute.value.split(',')
            : [attribute.value];
        if (!availableAttributes[attribute.attributeCategory.name]) {
          availableAttributes[attribute.attributeCategory.name] = new Set(
            attributeValues
          );
        } else {
          if (Array.isArray(attributeValues)) {
            attributeValues.forEach((value) => {
              availableAttributes[attribute.attributeCategory.name].add(value);
            });
          } else {
            availableAttributes[attribute.attributeCategory.name].add(
              attributeValues
            );
          }
        }
      });
    });
    const availableAttributesObj: Record<string, string[]> = Object.fromEntries(
      Object.entries(availableAttributes).map(([key, value]) => [
        key,
        Array.from(value).sort((a, b) => a.localeCompare(b)),
      ])
    );

    const totalCount = await db
      .select({ count: count() })
      .from(products)
      .where(or(eq(products.status, true), ...productsWhereArr))
      .then((result) => result[0].count);
    return {
      categoriesForSidebar: Array.from(categoriesForSidebar),
      availableAttributes: availableAttributesObj,
      productsList: productsQr,
      priceRange,
      productCount,
      pagination: {
        totalItems: totalCount,
        currentPage,
        itemsPerPage,
      },
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return null;
  }
}

export const fetchProductBySlug = async ({
  productSlug,
  userId,
}: {
  productSlug: string;
  userId: string | undefined;
}): Promise<TProductForShowPage | null> => {
  try {
    const productQr = await db.query.products.findFirst({
      where: and(eq(products.slug, productSlug), eq(products.status, true)),
      with: {
        favorites: userId ? { where: eq(favorites.userId, userId) } : undefined,
        images: true,
        discount: true,
        reviews: {
          with: {
            user: true,
          },
        },
        store: true,
        attributes: {
          with: {
            attributeCategory: true,
          },
        },
        categoryToProducts: {
          with: {
            category: {
              with: {
                categoryToAttributeCategory: true,
                discount: true,
              },
            },
          },
        },
      },
    });
    await new Promise((resolve) => setTimeout(resolve, 10000));
    return productQr ?? null;
  } catch (error) {
    console.error('Error fetching products:', error);
    return null;
  }
};

export const fetchAllProducts = async () => {
  try {
    const res = await db.query.products.findMany({
      where: and(eq(products.status, true), eq(stores.isActive, true)),
      with: {
        images: true,
        categoryToProducts: true,
        favorites: true,
        attributes: {
          with: {
            product: true,
          },
        },
        discount: true,
        reviews: true,
        store: true,
      },
    });

    return res;
  } catch {
    return null;
  }
};

export async function fetchStoreRatingByProductSlug(
  productSlug: string
): Promise<number | null> {
  try {
    const productQr = await db.query.products.findFirst({
      where: eq(products.slug, productSlug),
      with: {
        store: {
          with: {
            products: {
              with: {
                reviews: true,
              },
            },
          },
        },
      },
    });

    if (!productQr) {
      console.error(`Product with slug ${productSlug} not found`);
      return null;
    }

    const allRatings = productQr.store.products.flatMap((product) =>
      product.reviews.map((review) => review.rating)
    );

    if (allRatings.length === 0) {
      return null;
    }

    const averageRating =
      allRatings.reduce((sum, rating) => sum + Number(rating), 0) /
      allRatings.length;

    return Number((averageRating * 2).toFixed(2));
  } catch (error) {
    console.error('Error fetching store rating:', error);
    return null;
  }
}

export async function fetchSimilarProducts(productSlug: string) {
  const productsQuery = await db.query.products.findFirst({
    where: eq(products.slug, productSlug),
    with: {
      categoryToProducts: {
        with: {
          category: {
            with: {
              products: {
                with: {
                  product: {
                    with: {
                      images: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
  if (!productsQuery) {
    return null;
  }
  const similarProductsArr: (TProduct & {
    images: TProductImage[];
  })[] = [];
  productsQuery.categoryToProducts.forEach((mapTable) => {
    mapTable.category.products.forEach((products) => {
      if (products.product.slug !== productSlug) {
        similarProductsArr.push(products.product);
      }
    });
  });

  return similarProductsArr;
}

export const fetchProductsByStoreId = async ({
  storeId,
  currentPage,
  includeUnapprovedStores,
  itemsPerPage,
  querySearch,
  sortBy,
}: {
  storeId: string;
  sortBy?: {
    sort?: string;
    order?: string;
  };
  currentPage?: number;
  itemsPerPage?: number;
  querySearch?: string;
  includeUnapprovedStores?: boolean;
}) => {
  try {
    const whererArr: any[] = [];
    if (querySearch?.length && querySearch?.length > 0) {
      whererArr.push(
        ilike(products.name, `%${querySearch}%`),
        ilike(products.description, `%${querySearch}%`),
        ilike(products.summary, `%${querySearch}%`),
        ilike(products.brand, `%${querySearch}%`)
      );
      const parsedPrice = parseFloat(querySearch);
      if (parsedPrice) {
        whererArr.push(eq(products.price, querySearch));
      }
      const querySearchLowerCase = querySearch.toLowerCase();
      if (querySearchLowerCase === 'true' || querySearchLowerCase === 'false') {
        whererArr.push(
          eq(products.status, querySearchLowerCase === 'true' ? true : false)
        );
      }
    }
    const query = await db.query.products.findMany({
      where: and(or(...whererArr), eq(products.storeId, storeId)),
      with: {
        images: true,
        categoryToProducts: {
          with: {
            category: {
              with: {
                discount: true,
              },
            },
          },
        },
        discount: true,
        reviews: true,
        attributes: {
          with: {
            product: true,
          },
        },
      },
      offset:
        itemsPerPage && currentPage
          ? (currentPage - 1) * itemsPerPage
          : undefined,
      limit: itemsPerPage ? itemsPerPage : undefined,
      orderBy(fields, operators) {
        if (sortBy?.sort === 'total_price') {
          return [
            operators[sortBy.order as 'asc' | 'desc'](
              fields[sortBy.sort as keyof TProduct]
            ),
          ];
        } else {
          return [operators.desc(fields.createdAt)];
        }
      },
    });
    // const productDiscountSchema = aliasedTable(
    //   schema.discounts,
    //   'product_discount'
    // );
    // const tempQuery = await db
    //   .select({
    //     ...getTableColumns(schema.products),
    //     images: sql<schema.TProductImage>`json_agg(${schema.productImages})`,
    //     categoryToProducts: sql<
    //       (schema.TCategoriesToProductsMap & {
    //         category: schema.TCategory & { discount: schema.TDiscount };
    //       })[]
    //     >`json_agg(json_build_object( ${sql.raw(
    //       getColStringForJSONBuildObj(
    //         getTableColumns(schema.categoryToProductMap),
    //         'category_to_product'
    //       )
    //     )} , 'category' , json_build_object( ${sql.raw(
    //       getColStringForJSONBuildObj(
    //         getTableColumns(schema.categories),
    //         'category'
    //       )
    //     )} , 'discount' , discount )))`,
    //     discount: productDiscountSchema,
    //     reviews: sql<schema.TReview[]>`json_agg(${schema.reviews})`,
    //     attributes: sql<
    //       schema.TProductAttribute[]
    //     >`json_agg(${schema.productAttributes})`,
    //   })
    //   .from(schema.products)
    //   .leftJoin(
    //     schema.productImages,
    //     eq(schema.productImages.productId, schema.products.id)
    //   )
    //   .leftJoin(
    //     schema.categoryToProductMap,
    //     eq(schema.products.id, schema.categoryToProductMap.productId)
    //   )
    //   .leftJoin(
    //     schema.categories,
    //     eq(schema.categoryToProductMap.categoryId, schema.categories.id)
    //   )
    //   .leftJoin(
    //     schema.discounts,
    //     eq(schema.categories.discountId, schema.discounts.id)
    //   )
    //   .leftJoin(
    //     productDiscountSchema,
    //     eq(schema.products.discountId, productDiscountSchema.id)
    //   )
    //   .leftJoin(
    //     schema.productAttributes,
    //     eq(schema.products.id, schema.productAttributes.productId)
    //   )
    //   .leftJoin(
    //     schema.reviews,
    //     eq(schema.products.id, schema.reviews.productId)
    //   )
    //   .where(eq(schema.products.storeId, storeId))
    //   .groupBy(schema.products.id, productDiscountSchema.id)
    //   .limit(10);
    const countOfProducts = await db
      .select({ count: count() })
      .from(products)
      .where(and(or(...whererArr), eq(products.storeId, storeId)));
    return { countOfProducts: countOfProducts[0].count ?? 0, products: query };
  } catch (error) {
    console.error('Error fetching products:', error);
    return { countOfProducts: 0, products: [] };
  }
};
