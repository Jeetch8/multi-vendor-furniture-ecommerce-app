'use client';

import { navbarCategories, navbarCollections } from '@/utils/mockData';
import React, { useState } from 'react';
import LinkUnderlined from '../Animated/LinkUnderlined';
import Container from './Container';
import { spaceMono } from '@/lib/fonts';
import { LuShoppingBag, LuUser, LuSearch } from 'react-icons/lu';
import { AnimatePresence } from 'motion/react';

import ShopMenu from '@/components/NavigationBar/ShopMenu';
import CollectionMenu from '@/components/NavigationBar/CollectionMenu';
import UserDisplay from '@/components/NavigationBar/UserDisplay';
import { useSession } from 'next-auth/react';
import Logo from './Logo';

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
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="hover-underline-animation"
                >
                  SEARCH
                </button>
              </div>
              <UserDisplay />
              <div className="flex items-center gap-1">
                <LuShoppingBag size={20} />
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="hover-underline-animation"
                >
                  CART
                </button>
              </div>
            </div>
          </div>
        </Container>

        <AnimatePresence>
          {isShopOpen && (
            <ShopMenu
              categories={navbarCategories}
              setIsShopOpen={setIsShopOpen}
              isShopOpen={isShopOpen}
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
    </>
  );
};

export default Navbar;
