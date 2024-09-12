import { InferQueryModel } from '@/utils/QueryTypesBuilder';

export type TOrderForMyOrders = InferQueryModel<
  'orders',
  {
    with: {
      orderToStores: {
        with: {
          order: {
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

// export type OrderWithDetails = TOrder & {
//   user: UserBasic;
//   orderStores: Array<
//     TOrdersToStore & {
//       shipment: TShipment;
//       shippingAddress: TAddress;
//       orderItems: Array<
//         TOrderItem & {
//           product: TProduct;
//         }
//       >;
//     }
//   >;
// };

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
