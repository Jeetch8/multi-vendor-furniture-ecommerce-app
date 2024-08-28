import { InferQueryModel } from '@/utils/QueryTypesBuilder';

export type TProductsForFavorites = InferQueryModel<
  'favorites',
  {
    with: {
      product: {
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
      };
    };
  }
>;
