import { TCategoryForSidebar } from './Category';
import { InferQueryModel } from '@/utils/QueryTypesBuilder';

export type TProductsForWithOptions = {
  categoriesForSidebar: string[];
  availableAttributes: Record<string, string[]>;
  productsList: TProductsForList[];
  priceRange: { min: number; max: number };
  productCount: number;
  pagination: {
    totalItems: number;
    currentPage: number;
    itemsPerPage: number;
  };
};

export type TProductsForList = InferQueryModel<
  'products',
  {
    with: {
      images: true;
      reviews: true;
      store: true;
      attributes: true;
      discount: true;
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
>;

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

export type TProductWithDiscounts = InferQueryModel<
  'products',
  {
    with: {
      discount: true;
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
>;

export type TProductCard = InferQueryModel<
  'products',
  {
    with: {
      images: true;
      discount: true;
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
>;
