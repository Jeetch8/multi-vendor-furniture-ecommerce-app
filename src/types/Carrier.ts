import { InferQueryModel } from '@/utils/QueryTypesBuilder';

export type TStoreToCarrierForTable = InferQueryModel<
  'storeToCarriers',
  {
    with: {
      carrier: {
        with: {
          shippingRates: true;
        };
      };
    };
  }
>;
