import { db } from '../db';
import { count, eq, gte, ilike, inArray, lte, or } from 'drizzle-orm';
import { categories, productAttributes, products } from '../schema';
import { TProductForList } from '@/types/Product';

export async function fetchProductsForList(
  searchParamsObj: Record<string, string>
): Promise<TProductForList | null> {
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
    if (searchParamsObj.searchQuery) {
      productsWhereArr.push(
        ilike(products.name, searchParamsObj.searchQuery),
        ilike(products.brand, searchParamsObj.searchQuery)
      );
    }
    if (minPrice || maxPrice) {
      const minPriceNum = Number(minPrice);
      const maxPriceNum = Number(maxPrice);

      if (!isNaN(minPriceNum)) {
        productsWhereArr.push(gte(products.price, minPriceNum));
      }

      if (!isNaN(maxPriceNum)) {
        productsWhereArr.push(lte(products.price, maxPriceNum));
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
      if (product.price < priceRange.min) {
        priceRange.min = product.price;
      }
      if (product.price > priceRange.max) {
        priceRange.max = product.price;
      }
      const mapTable = product.categoryToProducts;
      if (mapTable.category.subCategories.length > 0) {
        mapTable.category.subCategories.forEach((subCategory) => {
          categoriesForSidebar.add(subCategory.name);
        });
      } else {
        categoriesForSidebar.add(mapTable.category.name);
      }
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
