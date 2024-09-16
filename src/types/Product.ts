import { SQL } from 'drizzle-orm';
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

export type TProductForTable = InferQueryModel<
  'products',
  {
    with: {
      images: true;
      reviews: true;
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
      attributes: {
        with: {
          product: true;
        };
      };
    };
  }
>;

export type TProductWithRelations = InferQueryModel<
  'products',
  {
    with: {
      attributes: true;
      categoryToProducts: true;
      discount: true;
      favorites: true;
      images: true;
      orderItems: true;
      reviews: true;
      store: true;
    };
  }
>;

export type TSortableProductFields = keyof Partial<TProductWithRelations>;

export type SortableProductFields = keyof Partial<TProductWithRelations>;
