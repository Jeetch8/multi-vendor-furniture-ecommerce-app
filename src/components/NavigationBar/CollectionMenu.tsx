import React from 'react';
import { motion } from 'framer-motion';
import LinkUnderlined from '../shared/Animated/LinkUnderlined';
import Container from '@/components/shared/ui/Container';
import { containerVariants, itemVariants } from '../shared/ui/Navbar';
import Image from 'next/image';
import { TCollection } from '@/lib/schema';

interface CollectionMenuProps {
  collections: TCollection[];
  setIsCollectionsOpen: (isOpen: boolean) => void;
}

const CollectionMenu = ({
  collections,
  setIsCollectionsOpen,
}: CollectionMenuProps) => {
  return (
    <motion.div
      className="absolute w-full bg-white border-b border-gray-custom-2 py-8 shadow-sm"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
      onMouseEnter={() => setIsCollectionsOpen(true)}
      onMouseLeave={() => setIsCollectionsOpen(false)}
    >
      <Container>
        <div className="grid grid-cols-5 gap-8">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.slug}
              variants={itemVariants}
              className="flex flex-col items-center space-y-4"
            >
              <motion.div
                className="relative w-full aspect-square overflow-hidden rounded-lg"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src={collection.image ?? ''}
                  alt={collection.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </motion.div>
              <LinkUnderlined
                href={`/collections/${collection.slug}`}
                className="text-center text-sm"
              >
                {collection.name}
              </LinkUnderlined>
            </motion.div>
          ))}
        </div>
      </Container>
    </motion.div>
  );
};

export default CollectionMenu;
