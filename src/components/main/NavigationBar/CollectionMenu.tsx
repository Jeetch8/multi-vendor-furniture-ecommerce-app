import React, { memo } from 'react';
import { motion } from 'framer-motion';
import Container from '@/components/shared/ui/Container';
import { TCollection } from '@/lib/schema';
import { containerVariants, itemVariants } from '@/components/shared/ui/Navbar';
import LinkUnderlined from '@/components/shared/Animated/LinkUnderlined';
import { MotionNextImage } from '@/components/shared/Animated/MotionNextImage';
import Link from 'next/link';

interface CollectionMenuProps {
  collections: TCollection[];
  setIsCollectionsOpen: (isOpen: boolean) => void;
}

const CollectionMenu = memo(
  ({ collections, setIsCollectionsOpen }: CollectionMenuProps) => {
    return (
      <motion.div
        className="absolute w-full bg-secondary border-b border-gray-custom-2 py-8 shadow-sm"
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
                <Link
                  href={`/collections/${collection.slug}`}
                  className="relative w-full aspect-square overflow-hidden rounded-md"
                >
                  <MotionNextImage
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                    src={collection.image ?? ''}
                    alt={collection.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </Link>
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
  }
);

export default CollectionMenu;
