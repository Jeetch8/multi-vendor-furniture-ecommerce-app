import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import { faker } from '@faker-js/faker';
import { hash } from 'bcrypt';
import * as schema from '../src/lib/schema';
import { createId } from '@paralleldrive/cuid2';

const client = new Client({
  connectionString: process.env.DATABASE_URL!,
  ssl: false,
});

const db = drizzle(client, { schema });

const categoriesArr = [
  'Electronics',
  'Clothing',
  'Home & Garden',
  'Toys & Games',
  'Sports & Outdoors',
  'Books & Media',
  'Beauty & Personal Care',
  'Automotive',
  'Health & Wellness',
  'Jewelry & Watches',
];
const categoryAttributesArr = [
  'Color',
  'Size',
  'Material',
  'Style',
  'Brand',
  'RAM',
  'Storage',
  'Processor',
  'Battery',
  'Camera',
];
const productAttributesArr = {
  Color: ['Red', 'Blue', 'Green', 'Yellow', 'Purple'],
  Size: ['Small', 'Medium', 'Large', 'X-Large', 'XX-Large'],
  Material: ['Cotton', 'Polyester', 'Silk', 'Leather', 'Nylon'],
  Style: ['Casual', 'Formal', 'Sporty', 'Boho', 'Preppy'],
  Brand: ['Nike', 'Adidas', 'Puma', 'Under Armour', 'New Balance'],
  RAM: ['4GB', '8GB', '16GB', '32GB', '64GB'],
  Storage: ['128GB', '256GB', '512GB', '1TB', '2TB'],
  Processor: [
    'Intel Core i3',
    'Intel Core i5',
    'Intel Core i7',
    'AMD Ryzen 3',
    'AMD Ryzen 5',
    'AMD Ryzen 7',
  ],
  Battery: ['3000mAh', '4000mAh', '5000mAh', '6000mAh', '7000mAh'],
  Camera: ['12MP', '16MP', '24MP', '48MP', '108MP'],
};

const randomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateReview = ({
  userId,
  productId,
}: {
  userId: string;
  productId: string;
}) => {
  return {
    comment: faker.lorem.sentence({ min: 7, max: 15 }),
    userId,
    productId,
    rating: faker.number.int({ min: 0, max: 5 }),
  };
};

const generateUser = async () => {
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

const generateStore = (userId: string) => {
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
}) => {
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

const generateCategoryAttribute = ({
  name,
  type = 'single-select',
}: {
  name: string;
  type: 'single-select' | 'multi-select';
}) => {
  return {
    id: createId(),
    name,
    type,
    required: type === 'multi-select',
    options: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

const generateProduct = (storeId: string, discountId: string | null = null) => {
  const name = faker.commerce.productName();
  return {
    id: createId(),
    storeId,
    discountId,
    name,
    description: faker.commerce.productDescription(),
    summary: faker.commerce.productDescription().substring(0, 100),
    price: parseFloat(faker.commerce.price()),
    stock: randomInt(0, 100),
    slug: faker.helpers.slugify(name).toLowerCase() + '-' + createId(),
    status: faker.datatype.boolean(),
    brand: faker.company.name(),
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
}) => {
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
  await db.delete(schema.users);
  await db.delete(schema.stores);
  await db.delete(schema.categories);
  await db.delete(schema.attributeCategory);
  await db.delete(schema.products);
  await db.delete(schema.productAttributes);
  await db.delete(schema.categoryToProductMap);
  await db.delete(schema.categoryToAttributeCategoryMap);
  await db.delete(schema.discounts);
  await db.delete(schema.addresses);
  await db.delete(schema.reviews);
  await db.delete(schema.productImages);
  await db.delete(schema.orderItems);
  await db.delete(schema.favorites);
};

const seed = async () => {
  try {
    await client.connect();
    console.log('Connected to database');

    console.log('Clearing existing data...');
    await cleanDatabase();

    console.log('Generating users...');
    const users: (typeof schema.users.$inferSelect)[] = [];
    for (let i = 0; i < 10; i++) {
      const user = await generateUser();
      const result = await db.insert(schema.users).values(user).returning();
      users.push(result[0]);
    }

    console.log('Generating stores...');
    const stores: (typeof schema.stores.$inferSelect)[] = [];
    for (const user of users.slice(0, 5)) {
      const store = generateStore(user.id);
      const result = await db.insert(schema.stores).values(store).returning();
      stores.push(result[0]);
    }

    console.log('Generating categories...');
    const categories: (typeof schema.categories.$inferSelect)[] = [];
    for (const category of categoriesArr) {
      const categoryObj = generateCategory({
        category,
        discountId: null,
        parentId: null,
      });
      const result = await db
        .insert(schema.categories)
        .values(categoryObj)
        .returning();
      categories.push(result[0]);
    }

    console.log('Generating products...');
    const products: (typeof schema.products.$inferSelect)[] = [];
    for (const store of stores) {
      for (let i = 0; i < 10; i++) {
        const product = generateProduct(store.id);
        const result = await db
          .insert(schema.products)
          .values({
            ...product,
            price: product.price,
          })
          .returning();
        await db.insert(schema.categoryToProductMap).values({
          productId: result[0].id,
          categoryId: categories[i].id,
        });
        for (let k = 0; k < faker.number.int({ min: 3, max: 5 }); k++) {
          await db.insert(schema.productImages).values({
            productId: result[0].id,
            url: faker.image.url(),
            sequence: k,
            alt: faker.lorem.sentence(),
          });
        }
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

    console.log('Generating category attributes...');
    const categoryAttributes: schema.TAttributeCategory[] = [];
    for (let i = 0; i < 10; i++) {
      const attributeType = faker.helpers.arrayElement([
        'single-select',
        'multi-select',
      ]);
      const attribute = generateCategoryAttribute({
        name: categoryAttributesArr[i],
        type: attributeType,
      });
      const result = await db
        .insert(schema.attributeCategory)
        .values(attribute)
        .returning();
      await db.insert(schema.categoryToAttributeCategoryMap).values({
        categoryId: faker.helpers.arrayElement(categories).id,
        attributeCategoryId: result[0].id,
      });
      const productAttrData: schema.TProductAttribute[] = [];
      for (let j = 0; j < products.length; j++) {
        let attributeValue: string = faker.helpers.arrayElement(
          productAttributesArr[result[0].name]
        );
        if (attributeType === 'multi-select') {
          attributeValue = faker.helpers
            .arrayElements(
              productAttributesArr[
                result[0].name as keyof typeof productAttributesArr
              ],

              {
                min: 2,
                max: productAttributesArr[result[0].name].length,
              }
            )
            .join(', ');
        }
        productAttrData.push(
          generateProductAttribute({
            productId: products[j].id,
            attributeCategoryId: result[0].id,
            value: attributeValue,
          })
        );
      }
      await db.insert(schema.productAttributes).values(productAttrData);
      categoryAttributes.push(result[0]);
    }

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await client.end();
  }
};

seed();
