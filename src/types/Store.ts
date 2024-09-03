import { InferQueryModel } from '@/utils/QueryTypesBuilder';

export type TStoreForCheckout = InferQueryModel<
  'stores',
  {
    with: {
      storeToCarriers: {
        with: {
          carrier: { with: { shippingRates: true } };
        };
      };
    };
  }
>;
