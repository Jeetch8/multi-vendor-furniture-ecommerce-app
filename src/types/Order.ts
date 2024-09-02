import { InferQueryModel } from '@/utils/QueryTypesBuilder';

export type TOrderForMyOrders = InferQueryModel<
  'orders',
  {
    with: {
      orderToStores: {
        with: {
          orderItems: {
            with: {
              product: {
                with: {
                  images: true;
                };
              };
            };
          };
          store: true;
          shippingAddress: true;
          shipment: true;
        };
      };
    };
  }
>;
