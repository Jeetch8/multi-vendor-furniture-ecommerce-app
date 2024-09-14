import { InferQueryModel } from '@/utils/QueryTypesBuilder';

export type TCategoryForSidebar = InferQueryModel<
  'categories',
  { with: { subCategories: true } }
>;

export type TCategoryWithSubCategories = InferQueryModel<
  'categories',
  { with: { subCategories: true } }
>;

export type TCategoryForProduct = InferQueryModel<
  'categories',
  {
    with: {
      subCategories: true;
      products: {
        with: {
          product: true;
        };
      };
      categoryToAttributeCategory: {
        with: {
          attributeCategory: {
            with: {
              productAttributes: true;
            };
          };
        };
      };
    };
  }
>;
