import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';
import { faker } from '@faker-js/faker';
import { hash } from 'bcryptjs';
import * as schema from '@/lib/schema/index';
import { createId } from '@paralleldrive/cuid2';
import { join } from 'path';
import { TUnsplashResponse } from './types';
import fs from 'fs';
import {
  attributeCategoryArr,
  categoriesWithSubCategoriesArr,
  productAttributesArr,
  productTags,
} from './fakeData';

const db = drizzle(process.env.DATABASE_URL!, { schema });

const randomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const fetchImagesFromUnsplash = async (page_no: number = 1) => {
  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?page=${page_no}&per_page=30&query=nature&client_id=${process.env.UNSPLASH_CLIENT_ID}`
    );
    const jsondata: TUnsplashResponse = await res.json();
    return jsondata;
  } catch (error) {
    return null;
  }
};

const getRandomImages = async (): Promise<TUnsplashResponse['results']> => {
  const pathTofile = join(__dirname, 'seed_cached_data', 'unsplash-data.json');
  const fileData = await fs.readFileSync(pathTofile, {
    encoding: 'utf8',
  });
  if (fileData) {
    const jsonFileData: TUnsplashResponse = JSON.parse(fileData);
    return jsonFileData.results;
  } else {
    const data = await fetchImagesFromUnsplash();
    if (!data) throw Error('Error fetching data from Unsplash');
    fs.writeFileSync(pathTofile, JSON.stringify(data, null, 2));
    return data.results;
  }
};

const addRandomImagesToFile = async () => {
  const pageCount = 10;
  const pathTofile = join(__dirname, 'seed_cached_data', 'unsplash-data.json');

  const existingData = JSON.parse(fs.readFileSync(pathTofile, 'utf8'));
  let allResults = existingData.results || [];

  for (let page = 2; page <= pageCount; page++) {
    const data = await fetchImagesFromUnsplash(page);
    if (data && data.results) {
      allResults = [...allResults, ...data.results];
    }
    // Add delay to respect API rate limits
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  const updatedData = { ...existingData, results: allResults };
  fs.writeFileSync(pathTofile, JSON.stringify(updatedData, null, 2));
};

const generateReview = ({
  userId,
  productId,
}: {
  userId: string;
  productId: string;
}): typeof schema.reviews.$inferSelect => {
  return {
    id: createId(),
    comment: faker.lorem.sentence({ min: 7, max: 15 }),
    userId,
    productId,
    rating: faker.number.int({ min: 0, max: 5 }),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

const generateUser = async (
  role: 'ADMIN' | 'USER' | 'STORE_OWNER' = 'STORE_OWNER'
): Promise<typeof schema.users.$inferSelect> => {
  const password = await hash('PAssword!@12', 10);
  return {
    id: createId(),
    name: faker.person.fullName(),
    username: faker.internet.username(),
    email: faker.internet.email(),
    emailVerified: faker.date.past(),
    banner_img: faker.image.url(),
    image: faker.image.avatar(),
    password,
    isTwoFactorEnabled: false,
    role,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

const generateStore = (userId: string): typeof schema.stores.$inferSelect => {
  const storeName = faker.company.name();
  return {
    id: createId(),
    userId,
    storeName,
    slug: faker.helpers.slugify(storeName).toLowerCase(),
    description: faker.company.catchPhrase(),
    img: faker.image.url(),
    address: faker.location.streetAddress(),
    cellPhone: faker.phone.number(),
    isVerified: faker.datatype.boolean(),
    isActive: faker.datatype.boolean(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

const generateCategory = ({
  name,
  discountId,
  parentId,
}: {
  name: string;
  discountId: string | null;
  parentId: string | null;
}): typeof schema.categories.$inferSelect => {
  return {
    id: createId(),
    discountId,
    parentId,
    name: name,
    slug: faker.helpers.slugify(name).toLowerCase(),
    description: faker.commerce.productDescription(),
    isActive: faker.datatype.boolean(),
    image: faker.image.url(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

const generateAttributeCategory = ({
  name,
  type = 'string',
  options,
}: {
  name: string;
  type: 'string' | 'multi-select' | 'number';
  options?: string;
}): typeof schema.attributeCategory.$inferSelect => {
  return {
    id: createId(),
    name,
    type,
    required: type === 'multi-select',
    options: options ?? null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

const generateProduct = (
  storeId: string,
  discountId: string | null = null
): typeof schema.products.$inferSelect => {
  const name = faker.commerce.productName();
  return {
    id: createId(),
    storeId,
    discountId,
    name,
    description: faker.commerce.productDescription(),
    summary: faker.commerce.productDescription().substring(0, 100),
    price: faker.commerce.price(),
    stock: randomInt(0, 100),
    slug: faker.helpers.slugify(name).toLowerCase() + '-' + createId(),
    status: true,
    brand: faker.company.name(),
    tags: faker.helpers.arrayElement(productTags),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

const generateDiscount = (
  storeId: string
): typeof schema.discounts.$inferSelect => {
  return {
    id: createId(),
    storeId,
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    discountPercent: faker.commerce.price({ min: 10, max: 50 }),
    active: true,
    startDate: new Date(),
    endDate: new Date(faker.date.future()),
    image: faker.image.url(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

const generateProductAttribute = ({
  productId,
  attributeCategoryId,
  value,
}: {
  productId: string;
  attributeCategoryId: string;
  value: string;
}): typeof schema.productAttributes.$inferSelect => {
  return {
    id: createId(),
    productId,
    attributeCategoryId,
    value,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

const generateCarrier = (): typeof schema.carriers.$inferSelect => {
  return {
    id: createId(),
    name: faker.company.name(),
    code: createId(),
    trackingUrl: faker.internet.url(),
    logoUrl: faker.image.url(),
    isActive: true,
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
  };
};

const generateOrderItem = (
  orderId: string,
  productId: string,
  ordersToStoreId: string
): typeof schema.orderItems.$inferSelect => {
  const arrayOfSelectedAttributes: { attName: string; val: string }[] = [];
  for (let i = 0; i < faker.number.int({ min: 1, max: 5 }); i++) {
    const attName = faker.helpers.arrayElement(attributeCategoryArr);
    const val = faker.helpers.arrayElement(
      productAttributesArr[attName as keyof typeof productAttributesArr]
    );
    arrayOfSelectedAttributes.push({ attName, val });
  }
  return {
    id: createId(),
    orderId,
    ordersToStoreId,
    productId,
    quantity: faker.number.int({ min: 1, max: 10 }),
    price: faker.commerce.price(),
    selectedAttributes: arrayOfSelectedAttributes,
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
  };
};

const generateOrder = (userId: string): typeof schema.orders.$inferSelect => {
  return {
    id: createId(),
    userId,
    couponId: null,
    orderNo: createId(),
    totalPrice: faker.commerce.price(),
    orderStatus: faker.helpers.objectValue(schema.orderStatusEnum),
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
  };
};

const generateAddress = (
  userId: string
): typeof schema.addresses.$inferSelect => {
  return {
    id: createId(),
    userId,
    title: faker.lorem.sentence(),
    addressLine1: faker.location.streetAddress(),
    addressLine2: faker.location.streetAddress(),
    country: faker.location.country(),
    city: faker.location.city(),
    postalCode: faker.location.zipCode(),
    landmark: faker.location.streetAddress(),
    phoneNumber: faker.phone.number(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
  };
};

const generateFavorite = (
  userId: string,
  products: (typeof schema.products.$inferSelect)[]
): typeof schema.favorites.$inferSelect => {
  return {
    id: createId(),
    userId,
    productId: faker.helpers.arrayElement(products).id,
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
  };
};

const generateShippingRate = (
  carrierId: string
): typeof schema.shippingRates.$inferSelect => {
  return {
    id: createId(),
    carrierId,
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    baseRate: faker.commerce.price({ min: 5, max: 20 }),
    perKgRate: faker.commerce.price({ min: 1, max: 5 }),
    minWeight: faker.commerce.price({ min: 0.1, max: 1 }),
    maxWeight: faker.commerce.price({ min: 1, max: 10 }),
    isActive: faker.datatype.boolean(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

const generateShipment = (
  orderToStoreId: string,
  carrierId: string
): typeof schema.shipments.$inferSelect => {
  return {
    id: createId(),
    orderToStoreId,
    carrierId,
    trackingNumber: createId(),
    shippingMethod: faker.commerce.productName(),
    estimatedDelivery: faker.date.future(),
    actualDelivery: faker.date.future(),
    shippingCost: faker.commerce.price({ min: 5, max: 50 }),
    status: faker.helpers.objectValue(schema.shipmentStatusEnum),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

const getRotatingValuesOfArr = ({
  arr,
}: {
  arr: any[];
  functionToCall: Function;
}) => {
  if (typeof getRotatingValuesOfArr.prototype.counter === 'undefined') {
    getRotatingValuesOfArr.prototype.counter = 0;
  }
  getRotatingValuesOfArr.prototype.counter++;
};

const cleanDatabase = async () => {
  await db.delete(schema.products);
  await db.delete(schema.categories);
  await db.delete(schema.discounts);
  await db.delete(schema.stores);
  await db.delete(schema.attributeCategory);
  await db.delete(schema.categoryToAttributeCategoryMap);
  await db.delete(schema.productAttributes);
  await db.delete(schema.carts);
  await db.delete(schema.cartItems);
  await db.delete(schema.categoryToProductMap);
  await db.delete(schema.ordersToStore);
  await db.delete(schema.orders);
  await db.delete(schema.orderItems);
  await db.delete(schema.shipments);
  await db.delete(schema.shippingRates);
  await db.delete(schema.storeToCarriers);
  await db.delete(schema.carriers);
  await db.delete(schema.favorites);
  await db.delete(schema.addresses);
  await db.delete(schema.users);
  await db.delete(schema.authenticators);
  await db.delete(schema.passwordResetTokens);
  await db.delete(schema.twoFactorConfirmations);
  await db.delete(schema.twoFactorTokens);
};

const seed = async () => {
  try {
    await cleanDatabase();

    const users: (typeof schema.users.$inferSelect)[] = [];
    const addresses: (typeof schema.addresses.$inferSelect)[] = [];
    for (let i = 0; i < 10; i++) {
      const user = await generateUser();
      const result = await db.insert(schema.users).values(user).returning();
      const address = generateAddress(result[0].id);
      const addressResult = await db
        .insert(schema.addresses)
        .values(address)
        .returning();
      addresses.push(addressResult[0]);
      users.push(result[0]);
    }

    // Stores
    const carriers: (typeof schema.carriers.$inferSelect)[] = [];
    const stores: (typeof schema.stores.$inferSelect)[] = [];
    for (const user of users.slice(0, 5)) {
      const store = generateStore(user.id);
      const storeResult = await db
        .insert(schema.stores)
        .values(store)
        .returning();
      stores.push(storeResult[0]);
      const tempCarriers = Array.from(
        { length: faker.number.int({ min: 2, max: 4 }) },
        () => generateCarrier()
      );
      const carrierResult = await db
        .insert(schema.carriers)
        .values(tempCarriers)
        .returning();
      carriers.push(...carrierResult);
      const tempShippingRates = Array.from(
        { length: tempCarriers.length },
        (_, ind) => generateShippingRate(tempCarriers[ind].id)
      );
      const shippingRateResult = await db
        .insert(schema.shippingRates)
        .values(tempShippingRates)
        .returning();
      const tempStoreToCarriers = Array.from(
        { length: tempCarriers.length },
        (_, ind) => ({
          storeId: storeResult[0].id,
          carrierId: carrierResult[ind].id,
        })
      );
      await db.insert(schema.storeToCarriers).values(tempStoreToCarriers);
    }

    const discounts: (typeof schema.discounts.$inferSelect)[] = [];
    for (const store of stores) {
      const discount = generateDiscount(store.id);
      const result = await db
        .insert(schema.discounts)
        .values(discount)
        .returning();
      discounts.push(result[0]);
    }

    const categories: (schema.TCategory & {
      subCategories: schema.TCategory[];
    })[] = [];
    for (let i = 0; i < categoriesWithSubCategoriesArr.length; i++) {
      const currentCategory = categoriesWithSubCategoriesArr[i];
      const shouldUseDiscount = faker.datatype.boolean() && discounts[i]?.id;
      const parentCategoryObj = generateCategory({
        name: currentCategory.name,
        discountId: shouldUseDiscount ? discounts[i]?.id : null,
        parentId: null,
      });
      const parentCategoryRes = await db
        .insert(schema.categories)
        .values(parentCategoryObj)
        .returning();
      const subCategoriesArr: schema.TCategory[] = [];
      for (let j = 0; j < currentCategory.subCategories.length; j++) {
        const shouldUseDiscount = faker.datatype.boolean() && discounts[i]?.id;
        const currentSubCategory = currentCategory.subCategories[j];
        const categoryObj = generateCategory({
          name: currentSubCategory.name,
          discountId: shouldUseDiscount ? discounts[i]?.id : null,
          parentId: parentCategoryRes[0].id,
        });
        subCategoriesArr.push(categoryObj);
      }
      const subCategoriesRes = await db
        .insert(schema.categories)
        .values(subCategoriesArr)
        .returning();
      categories.push({
        ...parentCategoryRes[0],
        subCategories: subCategoriesRes,
      });
    }

    const imagesArray = await getRandomImages();
    const products: (typeof schema.products.$inferSelect)[] = [];
    let prevProdNumberOfImages = 0;
    for (let i = 0; i < stores.length; i++) {
      for (let k = 0; k < faker.number.int({ min: 10, max: 15 }); k++) {
        const product = generateProduct(stores[i].id);
        const result = await db
          .insert(schema.products)
          .values({
            ...product,
            price: product.price,
          })
          .returning();
        const selectedCategory = faker.helpers.arrayElement(categories);
        const selectedSubCategory = faker.helpers.arrayElement(
          selectedCategory.subCategories
        );
        await db.insert(schema.categoryToProductMap).values([
          {
            productId: result[0].id,
            categoryId: selectedCategory.id,
          },
          {
            productId: result[0].id,
            categoryId: selectedSubCategory.id,
          },
        ]);
        const numberOfImagesToGenerate = faker.number.int({ min: 3, max: 5 });
        for (let k = 0; k < numberOfImagesToGenerate; k++) {
          const randImgObj = imagesArray[k + prevProdNumberOfImages];
          await db.insert(schema.productImages).values({
            sequence: k,
            productId: result[0].id,
            url: randImgObj.urls.full,
            thumbUrl: randImgObj.urls.regular,
            smUrl: randImgObj.urls.small,
            alt: faker.lorem.sentence(),
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
        prevProdNumberOfImages =
          prevProdNumberOfImages + numberOfImagesToGenerate;
        const tempReviews: any = [];
        for (let j = 0; j < faker.number.int({ min: 5, max: 10 }); j++) {
          tempReviews.push(
            generateReview({
              productId: result[0].id,
              userId: users[j].id,
            })
          );
        }
        await db.insert(schema.reviews).values(tempReviews);
        products.push(result[0]);
      }
    }

    for (let i = 0; i < products.length; i++) {
      for (let j = 0; j < faker.number.int({ min: 2, max: 5 }); j++) {
        const attributeType = faker.helpers.arrayElement([
          'string',
          'multi-select',
          'number',
        ]);
        let selectableValues: string | undefined;
        if (attributeType === 'multi-select') {
          selectableValues =
            productAttributesArr[
              faker.helpers.arrayElement(
                attributeCategoryArr
              ) as keyof typeof productAttributesArr
            ].join(', ');
        }
        const attributeCategory = (
          await db
            .insert(schema.attributeCategory)
            .values(
              generateAttributeCategory({
                name: faker.helpers.arrayElement(attributeCategoryArr),
                type: attributeType,
              })
            )
            .returning()
        )[0];
        await db.insert(schema.categoryToAttributeCategoryMap).values({
          categoryId: faker.helpers.arrayElement(categories).id,
          attributeCategoryId: attributeCategory.id,
        });
        await db.insert(schema.productAttributes).values(
          generateProductAttribute({
            productId: products[i].id,
            attributeCategoryId: attributeCategory.id,
            value:
              attributeType === 'multi-select'
                ? selectableValues!
                : faker.helpers.arrayElement(
                    productAttributesArr[
                      attributeCategory.name as keyof typeof productAttributesArr
                    ]
                  ),
          })
        );
      }
    }

    for (const user of users) {
      await db
        .insert(schema.favorites)
        .values(generateFavorite(user.id, products))
        .returning();
    }

    // orders and orderItems
    for (let i = 0; i < users.length; i++) {
      for (
        let orderInd = 0;
        orderInd < faker.number.int({ min: 5, max: 10 });
        orderInd++
      ) {
        const order = generateOrder(users[i].id);
        const orderResult = await db
          .insert(schema.orders)
          .values(order)
          .returning();
        const orderToStoreResult = await db
          .insert(schema.ordersToStore)
          .values({
            orderId: orderResult[0].id,
            storeId: faker.helpers.arrayElement(stores).id,
            shippingAddressId: faker.helpers.arrayElement(addresses).id,
          })
          .returning();
        await db
          .insert(schema.shipments)
          .values(
            generateShipment(
              orderToStoreResult[0].id,
              faker.helpers.arrayElement(carriers).id
            )
          );
        const orderItems: (typeof schema.orderItems.$inferSelect)[] = [];
        for (let j = 0; j < faker.number.int({ min: 1, max: 5 }); j++) {
          orderItems.push(
            generateOrderItem(
              orderResult[0].id,
              products[j].id,
              orderToStoreResult[0].id
            )
          );
        }
        await db.insert(schema.orderItems).values(orderItems);
      }
    }
    const admin_user = await db
      .insert(schema.users)
      .values(await generateUser('ADMIN'))
      .returning();
    users.push(admin_user[0]);
    console.log('Database seeded successfully');
    const adminUsers = users.filter((u) => u.role === 'ADMIN');
    const storeOwnerUsers = users.filter((u) => u.role === 'STORE_OWNER');
    const registeredUserInfo = {
      adminUsers,
      storeOwnerUsers,
    };
    fs.writeFileSync(
      join(__dirname, 'seed_cached_data', 'registered_user_info.json'),
      JSON.stringify(registeredUserInfo, null, 2)
    );
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    process.exit(0);
  }
};

seed();
// addRandomImagesToFile();

// TODO: create shipment and shipping rates
