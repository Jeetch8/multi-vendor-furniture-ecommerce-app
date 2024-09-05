'use client';

import { TAddress } from '@/lib/schema';
import { Elements } from '@stripe/react-stripe-js';
import { User } from 'next-auth';
import Link from 'next/link';
import { useEffect, useState, useTransition } from 'react';
import Input from '@/components/shared/ui/Input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCartContext } from '@/Context/CartContext';
import { stripePromise } from '@/lib/stripe';
import { convertToSubcurrency } from '@/utils/helpers';
import { TStoreForCheckout } from '@/types/Store';
import { HiOutlinePlusSm } from 'react-icons/hi';
import CheckoutStripeForm from './CheckoutStripeForm';

type CreateOrderFormProps = {
  userWithDetails: {
    user: User;
    addresses: TAddress[];
    carriers: TStoreForCheckout['storeToCarriers'] | undefined;
  };
};

function CreateOrderForm({
  userWithDetails: { addresses, user, carriers },
}: CreateOrderFormProps) {
  const { totalPrice, cart, calculateShippingCost, validCoupons } =
    useCartContext();
  const [success, setSuccess] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  );
  const [selectedCarriers, setSelectedCarriers] = useState<{
    [storeId: string]: string;
  }>({});
  const [activeStep, setActiveStep] = useState(0);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (selectedAddressId) setActiveStep(1);
    if (Object.keys(selectedCarriers).length > 0) setActiveStep(2);
  }, [selectedAddressId, selectedCarriers]);

  useEffect(() => {
    if (carriers) {
      Object.entries(selectedCarriers).forEach(([storeId, carrierId]) => {
        calculateShippingCost(storeId, carrierId, carriers);
      });
    }
    // eslint-disable-next-line
  }, [selectedCarriers, carriers]);

  const storeGroups = cart?.cartItems.reduce(
    (groups, item) => {
      const { storeId, store } = item.product;
      if (!groups[storeId]) {
        groups[storeId] = { storeName: store.storeName, items: [] };
      }
      groups[storeId].items.push(item);
      return groups;
    },
    {} as {
      [storeId: string]: { storeName: string; items: typeof cart.cartItems };
    }
  );

  const steps = [
    {
      title: 'SHIPPING DETAILS',
      content: (
        <div>
          <p className="mb-4 border-b font-semibold">Addresses</p>
          <div className="flex flex-col gap-3">
            {addresses.map((a) => (
              <div
                key={a.id}
                className={`rounded-md p-2.5 pl-1 transition-colors ${
                  selectedAddressId === a.id &&
                  'border border-orange-200 bg-orange-50'
                }`}
              >
                <Input
                  type="radio"
                  name="address"
                  label={a.addressLine1}
                  view="row"
                  value={a.id}
                  checked={selectedAddressId === a.id}
                  onChange={() => setSelectedAddressId(a.id)}
                />
              </div>
            ))}
            <span>
              <Link
                href="/account/addresses"
                className="flex items-center gap-1 text-blue-600 hover:text-orange-1 hover:underline"
              >
                <HiOutlinePlusSm className="h-6 w-6 text-orange-300" />
                Add a new address
              </Link>
            </span>
          </div>
        </div>
      ),
    },
    {
      title: 'DELIVERY DETAILS',
      content: (
        <div>
          {storeGroups &&
            Object.entries(storeGroups).map(([storeId, { storeName }]) => (
              <div key={storeId} className="mb-4">
                <p className="mb-1 font-semibold">Store: {storeName}</p>
                <Select
                  onValueChange={(value) =>
                    setSelectedCarriers((prev) => ({
                      ...prev,
                      [storeId]: value,
                    }))
                  }
                >
                  <SelectTrigger className="mx-1.5 w-full">
                    <SelectValue placeholder="Select shipping company" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Companies</SelectLabel>
                      {carriers
                        ?.filter((c) => c.storeId === storeId)
                        .map((c) => (
                          <SelectItem
                            key={`${c.carrierId}${c.storeId}`}
                            value={c.carrierId}
                            className="cursor-pointer"
                          >
                            {c.carrier.code}
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            ))}
        </div>
      ),
    },
    {
      title: 'PAYMENT DETAILS',
      content: (
        <Elements
          stripe={stripePromise}
          options={{
            mode: 'payment',
            amount: convertToSubcurrency(totalPrice),
            currency: 'usd',
          }}
        >
          <CheckoutStripeForm
            selectedCarriers={selectedCarriers}
            selectedAddressId={selectedAddressId as string}
          />
        </Elements>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {steps.map((step, index) => (
        <div key={index} className="overflow-hidden">
          <p className="border-b-[1px] border-gray-200 pb-1 font-semibold text-gray-600">
            {step.title}
          </p>
          {index <= activeStep && <div className="p-4">{step.content}</div>}
        </div>
      ))}
    </div>
  );
}

export default CreateOrderForm;
