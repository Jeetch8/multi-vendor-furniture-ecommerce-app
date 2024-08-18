'use client';

import React, { useState } from 'react';
import LinkUnderlined from '../Animated/LinkUnderlined';
import Container from './Container';
import { LuShoppingBag, LuSearch } from 'react-icons/lu';
import { AnimatePresence } from 'motion/react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { ChevronRight } from 'lucide-react';
import Hamburger from 'hamburger-react';
import { useSession } from 'next-auth/react';
import Logo from './Logo';
import { navbarCollections, navbarCategories } from '@/utils/mockData';
import {
  SearchDrawer,
  CollectionMenu,
  CollectionsDrawer,
  ShopDrawer,
  ShopMenu,
  UserDisplay,
} from '@/components/main/NavigationBar';

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.3,
    },
  },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const Navbar = () => {
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<
    'shop' | 'collections' | null
  >(null);
  const session = useSession();
  const user = session?.data?.user;

  return (
    <>
      <div className="sticky top-0 z-50 bg-white border-b border-gray-custom-2">
        <Container className="px-6 2xl:px-0">
          <div className="flex items-center justify-between py-4">
            <Logo />

            <div className="hidden md:flex items-center gap-6 text-lg">
              <div
                onMouseEnter={() => setIsShopOpen(true)}
                onMouseLeave={() => setIsShopOpen(false)}
              >
                <LinkUnderlined href="/products">SHOP</LinkUnderlined>
              </div>
              <div
                onMouseEnter={() => setIsCollectionsOpen(true)}
                onMouseLeave={() => setIsCollectionsOpen(false)}
              >
                <LinkUnderlined href="/">COLLECTIONS</LinkUnderlined>
              </div>
              <div className="flex items-center gap-1">
                <LuSearch size={20} />
                <button className="hover-underline-animation">SEARCH</button>
              </div>
              <UserDisplay />
              <div className="flex items-center gap-1">
                <LuShoppingBag size={20} />
                <button className="hover-underline-animation">CART</button>
              </div>
            </div>
            <div className="md:hidden">
              <Hamburger
                toggled={isMobileMenuOpen}
                toggle={setIsMobileMenuOpen}
                color="#000"
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
            <ShopMenu
              categories={navbarCategories}
              setIsShopOpen={setIsShopOpen}
            />
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
    </>
  );
};

export default Navbar;
