/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from 'react';
import { calculatePriceWithDiscounts } from '@/utils/helpers';
import { TCartWithDetails } from '@/types/Cart';
import { TStoreForCheckout } from '@/types/Store';
import { TCoupon } from '@/lib/schema';

export type ValidCouponsType = {
  categoryCoupons: TCoupon[];
  productCoupon: TCoupon | null;
}[];

type ShippingCostsType = {
  [storeId: string]: number;
};

type CartContextType = {
  priceAfterCoupon: number;
  totalSaving: number;
  totalPrice: number;
  subTotal: number;
  shippingCosts: ShippingCostsType;
  updateCartValues: (
    cart: TCartWithDetails,
    validCoupons: ValidCouponsType | null
  ) => void;
  cart: TCartWithDetails | undefined;
  updateCart: (newCart: TCartWithDetails | null) => void;
  validCoupons: ValidCouponsType | null;
  updateValidCoupons: (coupons: ValidCouponsType | null) => void;
  updateShippingCost: (storeId: string, cost: number) => void;
  calculateShippingCost: (
    storeId: string,
    carrierId: string,
    carriers: TStoreForCheckout['storeToCarriers']
  ) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

type CartProviderProps = {
  children: ReactNode;
  initialCart?: TCartWithDetails | undefined;
};

export const CartProvider: React.FC<CartProviderProps> = ({
  children,
  initialCart,
}) => {
  const [subTotal, setSubTotal] = useState<number>(0);
  const [priceAfterCoupon, setPriceAfterCoupon] = useState<number>(0);
  const [totalSaving, setTotalSaving] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [cart, setCart] = useState<TCartWithDetails | undefined>(initialCart);
  const [validCoupons, setValidCoupons] = useState<ValidCouponsType | null>(
    null
  );
  const [shippingCosts, setShippingCosts] = useState<ShippingCostsType>({});

  useEffect(() => {
    if (initialCart) {
      setCart(initialCart);
      updateCartValues(initialCart, validCoupons);
    }
  }, [initialCart]);

  const updateCart = useCallback(
    (newCart: TCartWithDetails | null) => {
      setCart(newCart || undefined);
      if (newCart) {
        updateCartValues(newCart, validCoupons);
      }
    },
    [validCoupons]
  );

  const updateValidCoupons = useCallback(
    (coupons: ValidCouponsType | null) => {
      setValidCoupons(coupons);
      if (cart) {
        updateCartValues(cart, coupons);
      }
    },
    [cart]
  );

  const updateShippingCost = useCallback((storeId: string, cost: number) => {
    setShippingCosts((prevCosts) => ({
      ...prevCosts,
      [storeId]: cost,
    }));
  }, []);

  const calculateShippingCost = useCallback(
    (
      storeId: string,
      carrierId: string,
      carriers: TStoreForCheckout['storeToCarriers']
    ) => {
      const selectedCarrierData = carriers?.find(
        (c) => c.carrierId === carrierId && c.storeId === storeId
      );
      if (!selectedCarrierData || !cart) return;

      const shippingRate = selectedCarrierData.carrier.shippingRates[0];
      if (!shippingRate) return;

      const storeItems = cart.cartItems.filter(
        (item) => item.product.storeId === storeId
      );
      const totalWeight = storeItems.reduce((acc, item) => {
        const productWeight =
          item.product.attributes.find(
            (attr) => attr.attributeCategory.name.toLowerCase() === 'weight'
          )?.value || '0';
        return acc + parseFloat(productWeight) * item.quantity;
      }, 0);

      const cost =
        shippingRate.baseRate + totalWeight * Number(shippingRate.perKgRate);
      updateShippingCost(storeId, Number(cost));
    },
    [cart, updateShippingCost]
  );

  const updateCartValues = useCallback(
    (
      currentCart: TCartWithDetails,
      currentValidCoupons: ValidCouponsType | null
    ) => {
      const newPriceAfterCoupon =
        currentValidCoupons?.reduce((total, coupon) => {
          const categoryDiscount = coupon.categoryCoupons.reduce(
            (sum, cat) => sum + Number(cat.discountAmount),
            0
          );
          const productDiscount = coupon.productCoupon
            ? Number(coupon.productCoupon.discountAmount)
            : 0;
          return total + categoryDiscount + productDiscount;
        }, 0) || 0;

      const newTotalSaving =
        currentCart.cartItems.reduce((total, item) => {
          const { totalSaving } = calculatePriceWithDiscounts(
            item.product,
            item.quantity
          );
          return total + totalSaving;
        }, 0) + newPriceAfterCoupon;

      const newSubTotal = currentCart.cartItems.reduce((total, item) => {
        const { finalPrice } = calculatePriceWithDiscounts(
          item.product,
          item.quantity
        );
        return total + finalPrice;
      }, 0);

      const newTotalPrice = newSubTotal - newPriceAfterCoupon;

      const totalShippingCost = Object.values(shippingCosts).reduce(
        (sum, cost) => sum + cost,
        0
      );

      setPriceAfterCoupon(newPriceAfterCoupon);
      setTotalSaving(newTotalSaving);
      setTotalPrice(newTotalPrice + totalShippingCost);
      setSubTotal(newSubTotal);
    },
    [shippingCosts]
  );

  const value: CartContextType = {
    priceAfterCoupon,
    totalSaving,
    subTotal,
    totalPrice,
    shippingCosts,
    updateCartValues,
    cart,
    updateCart,
    validCoupons,
    updateValidCoupons,
    updateShippingCost,
    calculateShippingCost,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCartContext = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
};
