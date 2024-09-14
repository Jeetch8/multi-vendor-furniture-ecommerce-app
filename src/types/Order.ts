import { InferQueryModel } from '@/utils/QueryTypesBuilder';

export type TOrderForMyOrders = InferQueryModel<
  'orders',
  {
    with: {
      orderItems: true;
      orderToStores: {
        with: {
          shipment: true;
          shippingAddress: true;
          store: true;
          orderItems: {
            with: {
              product: {
                with: {
                  images: true;
                };
              };
            };
          };
        };
      };
    };
  }
>;

export type TOrderWithDetails = InferQueryModel<
  'ordersToStore',
  {
    with: {
      order: {
        with: {
          user: true;
          orderItems: {
            with: {
              product: true;
            };
          };
        };
      };
    };
  }
>;
