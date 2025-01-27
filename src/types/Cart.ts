import { InferQueryModel } from '@/utils/QueryTypesBuilder';

export type TCartWithDetails = InferQueryModel<
  'carts',
  {
    with: {
      cartItems: {
        with: {
          product: {
            with: {
              images: true;
              store: true;
              discount: {
                with: {
                  category: true,
                  product: true
                };
              };
              attributes: {
                with: {
                  attributeCategory: true;
                };
              };
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
      };
    };
  }
>;
