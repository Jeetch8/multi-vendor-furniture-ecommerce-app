'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import React from 'react';

interface CategoryImageDisplayProps {
  selectedImage: any;
  alt: string;
}

const CategoryImageDisplay = ({
  selectedImage,
  alt,
}: CategoryImageDisplayProps) => {
  return (
    <div className="category-display overflow-hidden h-[400px] w-[400px] rounded-md relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={alt}
          initial={{ opacity: 0, scale: 1.2 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="relative w-full h-full"
        >
          <Image
            src={selectedImage}
            fill
            alt={alt}
            className="object-cover"
            sizes="400px"
            priority
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default CategoryImageDisplay;
