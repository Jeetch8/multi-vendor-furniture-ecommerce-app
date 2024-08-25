import { TCategoryForSidebar } from './Category';
import { InferQueryModel } from '@/utils/QueryTypesBuilder';

export type TProductsForList = {
  categoriesForSidebar: string[];
  availableAttributes: Record<string, string[]>;
  productsList: InferQueryModel<
    'products',
    {
      with: {
        images: true;
        reviews: true;
        store: true;
        attributes: true;
        categoryToProducts: {
          with: {
            category: {
              with: {
                discount: true;
              };
            };
          };
        };
      };
    }
  >[];
  priceRange: { min: number; max: number };
  productCount: number;
  pagination: {
    totalItems: number;
    currentPage: number;
    itemsPerPage: number;
  };
};

export type TProductForShowPage = InferQueryModel<
  'products',
  {
    with: {
      images: true;
      favorites: true;
      attributes: {
        with: {
          attributeCategory: true;
        };
      };
      reviews: {
        with: {
          user: true;
        };
      };
      store: true;
      categoryToProducts: {
        with: {
          category: {
            with: {
              categoryToAttributeCategory: true;
              discount: true;
            };
          };
        };
      };
      discount: true;
    };
  }
>;
