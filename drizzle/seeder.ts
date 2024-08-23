import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';
import { faker } from '@faker-js/faker';
import { hash } from 'bcryptjs';
import * as schema from '@/lib/schema/index';
import { createId } from '@paralleldrive/cuid2';
import { join } from 'path';
import { TUnsplashResponse } from './types';
import fs from 'fs';

const db = drizzle(process.env.DATABASE_URL!, { schema });

const categoriesArr = [
  'electronics',
  'clothing',
  'home-garden',
  'toys-games',
  'sports-outdoors',
  'books-media',
  'beauty-personal-care',
  'automotive',
  'health-wellness',
  'jewelry-watches',
];
const categoryAttributesArr = [
  'color',
  'size',
  'material',
  'style',
  'brand',
  'ram',
  'storage',
  'processor',
  'battery',
  'camera',
];
const productAttributesArr = {
  color: ['red', 'blue', 'green', 'yellow', 'purple'],
  size: ['small', 'medium', 'large', 'x-large', 'xx-large'],
  material: ['cotton', 'polyester', 'silk', 'leather', 'nylon'],
  style: ['casual', 'formal', 'sporty', 'boho', 'preppy'],
  brand: ['nike', 'adidas', 'puma', 'under armour', 'new balance'],
  ram: ['4GB', '8GB', '16GB', '32GB', '64GB'],
  storage: ['128GB', '256GB', '512GB', '1TB', '2TB'],
  processor: [
    'intel core i3',
    'intel core i5',
    'intel core i7',
    'amd ryzen 3',
    'amd ryzen 5',
    'amd ryzen 7',
  ],
  battery: ['3000mAh', '4000mAh', '5000mAh', '6000mAh', '7000mAh'],
  camera: ['12MP', '16MP', '24MP', '48MP', '108MP'],
};

const randomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const fetchImagesFromUnsplash = async (page_no: number = 1) => {
  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?page=${page_no}&per_page=30&query=nature&client_id=UrgeI-BR8KCMwcVaLcmmcd130yqXAMBY9nEytB3EyHY`
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

const generateUser = async (): Promise<typeof schema.users.$inferSelect> => {
  const password = await hash('password123', 10);
  return {
    id: createId(),
    name: faker.person.fullName(),
    username: faker.internet.username(),
    email: faker.internet.email(),
    emailVerified: faker.date.past(),
    banner_img: faker.image.url(),
    image: faker.image.avatar(),
    password,
    isTwoFactorEnabled: faker.datatype.boolean(),
    role: faker.helpers.arrayElement(['ADMIN', 'USER', 'STORE_OWNER']),
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
  category,
  discountId,
  parentId,
}: {
  category: string;
  discountId: string | null;
  parentId: string | null;
}): typeof schema.categories.$inferSelect => {
  return {
    id: createId(),
    discountId,
    parentId,
    name: category,
    slug: faker.helpers.slugify(category).toLowerCase(),
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
    price: parseInt(faker.commerce.price()),
    stock: randomInt(0, 100),
    slug: faker.helpers.slugify(name).toLowerCase() + '-' + createId(),
    status: true,
    brand: faker.company.name(),
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
    discountPercent: faker.number.int({ min: 10, max: 50 }),
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

const cleanDatabase = async () => {
  await db.delete(schema.products);
  await db.delete(schema.categories);
  await db.delete(schema.discounts);
  await db.delete(schema.users);
  await db.delete(schema.stores);
  await db.delete(schema.attributeCategory);
  await db.delete(schema.categoryToAttributeCategoryMap);
  await db.delete(schema.productAttributes);
  await db.delete(schema.carts);
  await db.delete(schema.cartItems);
  await db.delete(schema.categoryToProductMap);
  await db.delete(schema.addresses);
  await db.delete(schema.orders);
  await db.delete(schema.orderItems);
  await db.delete(schema.favorites);
};

const seed = async () => {
  try {
    await cleanDatabase();

    const users: (typeof schema.users.$inferSelect)[] = [];
    for (let i = 0; i < 10; i++) {
      const user = await generateUser();
      const result = await db.insert(schema.users).values(user).returning();
      users.push(result[0]);
    }

    const stores: (typeof schema.stores.$inferSelect)[] = [];
    for (const user of users.slice(0, 5)) {
      const store = generateStore(user.id);
      const result = await db.insert(schema.stores).values(store).returning();
      stores.push(result[0]);
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

    const categories: (typeof schema.categories.$inferSelect)[] = [];
    for (let i = 0; i < categoriesArr.length; i++) {
      const shouldUseDiscount = faker.datatype.boolean() && discounts[i]?.id;
      const categoryObj = generateCategory({
        category: categoriesArr[i],
        discountId: shouldUseDiscount ? discounts[i]?.id : null,
        parentId: null,
      });
      const result = await db
        .insert(schema.categories)
        .values(categoryObj)
        .returning();
      categories.push(result[0]);
    }

    const imagesArray = await getRandomImages();
    const products: (typeof schema.products.$inferSelect)[] = [];
    let prevProdNumberOfImages = 0;
    for (let i = 0; i < stores.length; i++) {
      for (let k = 0; k < 10; k++) {
        const product = generateProduct(stores[i].id);
        const result = await db
          .insert(schema.products)
          .values({
            ...product,
            price: product.price,
          })
          .returning();
        await db.insert(schema.categoryToProductMap).values({
          productId: result[0].id,
          categoryId: categories[k].id,
        });
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
                categoryAttributesArr
              ) as keyof typeof productAttributesArr
            ].join(', ');
        }
        const attributeCategory = (
          await db
            .insert(schema.attributeCategory)
            .values(
              generateAttributeCategory({
                name: faker.helpers.arrayElement(categoryAttributesArr),
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
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    process.exit(0);
  }
};

seed();
// addRandomImagesToFile();
