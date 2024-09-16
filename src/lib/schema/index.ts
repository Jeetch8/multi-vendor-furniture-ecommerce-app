import { addresses, addressesRelations } from './address.schema';
import {
  carriers,
  carriersRelations,
  storeToCarriers,
  storeToCarriersRelations,
} from './carrier.schema';
import {
  cartItems,
  cartItemsRelations,
  carts,
  cartsRelations,
} from './cart.schema';
import {
  categories,
  categoriesRelations,
  attributeCategory,
  attributeCategoryRelations,
  categoryToProductMap,
  categoryToAttributeCategoryMap,
  categoryToAttributeCategoryRelations,
} from './category.schema';
import { discounts, discountsRelations } from './discount.schema';
import { favorites, favoritesRelations } from './favorites.schema';
import {
  orders,
  ordersRelations,
  orderItems,
  orderItemsRelations,
  orderStatusEnum,
  ordersToStore,
  ordersToStoreRelations,
  orderStatusEnumSchema,
} from './order.schema';
import {
  productAttributes,
  productCategoryMappingRelations,
  products,
  productsRelations,
  productImages,
  productAttributesRelations,
  productImagesRelations,
} from './product.schema';
import { reviews, reviewsRelations } from './review.schema';
import { searchHistoryRelations, searchHistory } from './searchHistory.schema';
import {
  shipments,
  shipmentStatusEnum,
  shipmentsRelations,
  shippingRates,
  shippingRatesRelations,
  shipmentStatusEnumSchema,
} from './shipment.schema';
import {
  userRoleEnum,
  users,
  usersRelations,
  accounts,
  sessions,
  accountsRelations,
  verificationTokens,
  passwordResetTokens,
  twoFactorConfirmations,
  twoFactorConfirmationsRelations,
  twoFactorTokens,
  authenticators,
} from './user.schema';
import { storeRelations, stores } from './store.schema';
import { coupons, couponsRelations } from './coupon.schema';
import {
  collections,
  collectionsRelations,
  collectionsToProductsMap,
  collectionsToProductsMapRelations,
} from './collection.schema';

export type TAuthenticator = typeof authenticators.$inferSelect;
export type TSession = typeof sessions.$inferSelect;
export type TFavorite = typeof favorites.$inferSelect;
export type TCartItem = typeof cartItems.$inferSelect;
export type TCart = typeof carts.$inferSelect;
export type TDiscount = typeof discounts.$inferSelect;
export type TCoupon = typeof coupons.$inferSelect;
export type TUser = typeof users.$inferSelect;
export type TStore = typeof stores.$inferSelect;
export type TProduct = typeof products.$inferSelect;
export type TAttributeCategory = typeof attributeCategory.$inferSelect;
export type TProductAttribute = typeof productAttributes.$inferSelect;
export type TProductImage = typeof productImages.$inferSelect;
export type TCategory = typeof categories.$inferSelect;
export type TCategoriesToProductsMap = typeof categoryToProductMap.$inferSelect;
export type TCategoriesToAttributeCategoriesMap =
  typeof categoryToAttributeCategoryMap.$inferSelect;
export type TAccount = typeof accounts.$inferSelect;
export type TVerificationToken = typeof verificationTokens.$inferSelect;
export type TPasswordResetToken = typeof passwordResetTokens.$inferSelect;
export type TTwoFactorConfirmation = typeof twoFactorConfirmations.$inferSelect;
export type TTwoFactorToken = typeof twoFactorTokens.$inferSelect;
export type TReview = typeof reviews.$inferSelect;
export type TShipment = typeof shipments.$inferSelect;
export type TShippingRate = typeof shippingRates.$inferSelect;
export type TAddress = typeof addresses.$inferSelect;
export type TCarrier = typeof carriers.$inferSelect;
export type TStoreToCarrier = typeof storeToCarriers.$inferSelect;
export type TOrder = typeof orders.$inferSelect;
export type TOrderItem = typeof orderItems.$inferSelect;
export type TOrdersToStore = typeof ordersToStore.$inferSelect;
export type TSearchHistory = typeof searchHistory.$inferSelect;
export type TCollection = typeof collections.$inferSelect;
export type TCollectionsToProductsMap =
  typeof collectionsToProductsMap.$inferSelect;
export type TUserRole = (typeof userRoleEnum.enumValues)[number];
export type TOrderStatusEnum = typeof orderStatusEnum;
export type TShipmentStatusEnum = typeof shipmentStatusEnum;

export {
  shipmentStatusEnumSchema,
  orderStatusEnumSchema,
  collections,
  collectionsRelations,
  collectionsToProductsMap,
  collectionsToProductsMapRelations,
  authenticators,
  favorites,
  favoritesRelations,
  productAttributesRelations,
  productImagesRelations,
  accountsRelations,
  cartItems,
  cartItemsRelations,
  carts,
  cartsRelations,
  twoFactorConfirmationsRelations,
  discounts,
  coupons,
  userRoleEnum,
  users,
  usersRelations,
  stores,
  storeRelations,
  products,
  productCategoryMappingRelations,
  productsRelations,
  attributeCategory,
  attributeCategoryRelations,
  productAttributes,
  productImages,
  categories,
  categoriesRelations,
  categoryToProductMap,
  categoryToAttributeCategoryMap,
  categoryToAttributeCategoryRelations,
  accounts,
  verificationTokens,
  passwordResetTokens,
  twoFactorConfirmations,
  twoFactorTokens,
  reviews,
  reviewsRelations,
  shipments,
  shipmentStatusEnum,
  shipmentsRelations,
  shippingRates,
  shippingRatesRelations,
  addresses,
  addressesRelations,
  carriers,
  carriersRelations,
  storeToCarriers,
  storeToCarriersRelations,
  orders,
  ordersRelations,
  orderItems,
  orderItemsRelations,
  orderStatusEnum,
  ordersToStore,
  ordersToStoreRelations,
  couponsRelations,
  discountsRelations,
  searchHistory,
  searchHistoryRelations,
};
