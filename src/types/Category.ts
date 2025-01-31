import { InferQueryModel } from '@/utils/QueryTypesBuilder';

export type TCategoryForSidebar = InferQueryModel<
  'categories',
  { with: { subCategories: true } }
>;

export type TCategoryWithSubCategories = InferQueryModel<
  'categories',
  { with: { subCategories: true } }
>;

export type TCategoryForContext = InferQueryModel<"categories", {
  with: {
    categoryToAttributeCategory: {
      with: {
        attributeCategory: true
      }
    },
    subCategories: true
  }
}>


export type TCategoryForProduct = InferQueryModel<
  'categories',
  {
    with: {
      subCategories: {
        with: {
          products: {
            with: {
              product: true;
            };
          };
        }
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

export type TProductToCategoryWithCategory = InferQueryModel<
  'categoryToProductMap',
  {
    with: {
      category: true;
    };
  }
>;
