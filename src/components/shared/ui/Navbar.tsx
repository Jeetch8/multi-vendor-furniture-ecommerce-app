'use client';

import React, { useState } from 'react';
import LinkUnderlined from '../Animated/LinkUnderlined';
import Container from './Container';
import { LuShoppingBag, LuSearch } from 'react-icons/lu';
import { AnimatePresence } from 'motion/react';
import SearchDrawer from '@/components/main/NavigationBar/SearchDrawer';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { ChevronRight } from 'lucide-react';
import Hamburger from 'hamburger-react';
import ShopDrawer from '@/components/main/NavigationBar/ShopDrawer';
import CollectionsDrawer from '@/components/main/NavigationBar/CollectionsDrawer';
import ShopMenu from '@/components/main/NavigationBar/ShopMenu';
import CollectionMenu from '@/components/main/NavigationBar/CollectionMenu';
import UserDisplay from '@/components/main/NavigationBar/UserDisplay';
import { useSession } from 'next-auth/react';
import Logo from './Logo';
import { navbarCategories, navbarCollections } from '@/utils/mockData';
import CartDrawer from '@/components/main/NavigationBar/CartDrawer';
import { TCategoryWithSubCategories } from '@/types';

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.3,
    },
  },
};

export const itemVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const Navbar = ({
  categories,
}: {
  categories: TCategoryWithSubCategories[];
}) => {
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<
    'shop' | 'collections' | null
  >(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const session = useSession();
  const user = session?.data?.user;

  return (
    <>
      <div className="sticky top-0 z-50 bg-background border-b border-gray-custom-2">
        <Container className="px-6 2xl:px-0">
          <div className="flex items-center justify-between">
            <Logo />

            <div className="hidden md:flex items-center gap-6 text-lg">
              <div
                className="py-4"
                onMouseEnter={() => setIsShopOpen(true)}
                onMouseLeave={() => setIsShopOpen(false)}
              >
                <LinkUnderlined href="/products">SHOP</LinkUnderlined>
              </div>
              <div
                className="py-4"
                onMouseEnter={() => setIsCollectionsOpen(true)}
                onMouseLeave={() => setIsCollectionsOpen(false)}
              >
                <LinkUnderlined href="/">COLLECTIONS</LinkUnderlined>
              </div>
              <div className="flex items-center gap-1 py-4">
                <LuSearch size={20} />
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="hover-underline-animation"
                >
                  SEARCH
                </button>
              </div>
              <UserDisplay />
              <div className="flex items-center gap-1 py-4">
                <LuShoppingBag size={20} />
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="hover-underline-animation"
                >
                  CART
                </button>
              </div>
            </div>
            <div className="md:hidden">
              <Hamburger
                toggled={isMobileMenuOpen}
                toggle={setIsMobileMenuOpen}
                color={'hsl(var(--primary))'}
                label="Menu"
                size={24}
                distance="sm"
                easing="ease-in"
                rounded
                hideOutline
              />
            </div>
          </div>
        </Container>

        <AnimatePresence>
          {isShopOpen && (
            <ShopMenu categories={categories} setIsShopOpen={setIsShopOpen} />
          )}

          {isCollectionsOpen && (
            <CollectionMenu
              collections={navbarCollections}
              setIsCollectionsOpen={setIsCollectionsOpen}
            />
          )}
        </AnimatePresence>
      </div>

      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="right" className="w-full max-w-xs p-2">
          <div className="flex flex-col space-y-3 h-full text-xl mt-10">
            <button
              onClick={() => setActiveSubmenu('shop')}
              className="flex items-center justify-between w-full"
            >
              <LinkUnderlined href="/products">SHOP</LinkUnderlined>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveSubmenu('collections')}
              className="flex items-center justify-between w-full"
            >
              <LinkUnderlined>COLLECTIONS</LinkUnderlined>
              <ChevronRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-between w-full">
              <LinkUnderlined href="/search">SEARCH</LinkUnderlined>
              <ChevronRight className="w-4 h-4" />
            </div>

            <div className="flex items-center justify-between w-full">
              {user ? (
                <LinkUnderlined href="/account">ACCOUNT</LinkUnderlined>
              ) : (
                <LinkUnderlined href="/signin">LOGIN</LinkUnderlined>
              )}
              <ChevronRight className="w-4 h-4" />
            </div>

            <div className="flex items-center justify-between w-full">
              <LinkUnderlined href="/cart">CART</LinkUnderlined>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <ShopDrawer
        categories={navbarCategories}
        activeSubmenu={activeSubmenu}
        setActiveSubmenu={setActiveSubmenu}
      />

      <CollectionsDrawer
        collections={navbarCollections}
        activeSubmenu={activeSubmenu}
        setActiveSubmenu={setActiveSubmenu}
      />

      <SearchDrawer
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;
