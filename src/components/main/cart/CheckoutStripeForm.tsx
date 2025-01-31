'use client';

import {
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';

import { createOrder, deleteCart, deleteOrder } from '@/actions/cart';
import Button from '@/components/shared/ui/Button';
import FormError from '@/components/shared/ui/FormError';
import MiniSpinner from '@/components/shared/ui/MiniSpinner';
import { useCartContext } from '@/Context/CartContext';
import { convertToSubcurrency, roundToTwoDecimals } from '@/utils/helpers';
import { useCurrentUser } from '@/hooks/use-current-user';

type CheckoutStripeFormProps = {
  selectedCarriers: { [key: string]: string };
  selectedAddressId: string;
};

function CheckoutStripeForm({
  selectedCarriers,
  selectedAddressId,
}: CheckoutStripeFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState<string>('');
  const [error, setError] = useState<string>();
  const { totalPrice, shippingCosts, validCoupons } = useCartContext();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const user = useCurrentUser();

  const shippingTotal = Object.values(shippingCosts).reduce(
    (cost, sum) => (sum += cost),
    0
  );

  const domain =
    process.env.NODE_ENV === 'production'
      ? process.env.NEXT_PUBLIC_APP_URL
      : process.env.NEXT_PUBLIC_AUTH_TRUST_HOST;

  const finalPrice = totalPrice + shippingTotal;

  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ amount: convertToSubcurrency(finalPrice) }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `HTTP error! status: ${response.status}, body: ${errorText}`
          );
        }

        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error('Error fetching client secret:', error);
      }
    };

    fetchClientSecret();
  }, [finalPrice]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) return;
    setIsLoading(true);

    const { error: submitError } = await elements.submit();

    if (submitError) {
      setError(submitError.message);
      return;
    }

    let orderWithDetails = {
      selectedAddressId,
      selectedCarriers,
      totalPrice: finalPrice,
      validCoupons,
    };

    const { orderNo } = await createOrder({
      orderDetails: orderWithDetails,
      formState: {},
    });

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${domain}/payment-success?order=${orderNo}`,
      },
      redirect: 'if_required',
    });
    setIsLoading(false);

    if (error) {
      setError('An error occurred while making payment. Please try again.');

      if (typeof orderNo === 'string') {
        deleteOrder(orderNo);
      }
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      deleteCart(user?.id as string);
      router.push(`${domain}/payment-success?order=${orderNo}`);
    }
  };

  if (!clientSecret || !stripe || !elements) {
    return <MiniSpinner />;
  }

  return (
    <form onSubmit={handleSubmit} className="relative bg-white p-2">
      {clientSecret && <PaymentElement />}
      <div className="absolute right-0 top-0 text-xs text-gray-300">
        fake credit card: 4242-4242-4242-4242
      </div>
      <div className="mt-2">{error && <FormError>{error}</FormError>}</div>

      <Button el="button" className="mt-6 w-full">
        {isLoading ? (
          <MiniSpinner />
        ) : (
          `Complete Order ${roundToTwoDecimals(totalPrice + shippingTotal)}`
        )}
      </Button>
    </form>
  );
}

export default CheckoutStripeForm;
