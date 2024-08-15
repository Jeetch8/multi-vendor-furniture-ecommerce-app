import { motion } from 'framer-motion';
import React from 'react';
import { TCategoryForSidebar } from '@/types/Category';
import LinkUnderlined from '../shared/Animated/LinkUnderlined';
import Container from '@/components/shared/ui/Container';
import { containerVariants, itemVariants } from '../shared/ui/Navbar';

interface ShopMenuProps {
  categories: TCategoryForSidebar[];
  setIsShopOpen: (isOpen: boolean) => void;
}

const ShopMenu = ({ categories, setIsShopOpen }: ShopMenuProps) => {
  return (
    <motion.div
      className="absolute w-full bg-white border-b border-gray-custom-2 py-8 shadow-sm"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
      onMouseEnter={() => setIsShopOpen(true)}
      onMouseLeave={() => setIsShopOpen(false)}
    >
      <Container>
        <div className="grid grid-cols-5 gap-8">
          {categories.map((category) => (
            <motion.div
              key={category.slug}
              variants={itemVariants}
              className="flex flex-col space-y-4"
            >
              <LinkUnderlined
                href={`/category/${category.slug}`}
                className="font-semibold text-gray-400 text-lg w-fit"
              >
                {category.name}
              </LinkUnderlined>
              <div className="flex flex-col space-y-3">
                {category.subCategories.map((subCategory) => (
                  <motion.div key={subCategory.slug} variants={itemVariants}>
                    <LinkUnderlined
                      href={`/category/${category.slug}/${subCategory.slug}`}
                      className="text-sm"
                    >
                      {subCategory.name}
                    </LinkUnderlined>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </motion.div>
  );
};

export default ShopMenu;
