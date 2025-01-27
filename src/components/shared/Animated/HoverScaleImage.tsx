'use client';

import React from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { clsx } from 'clsx';

interface HoverScaleImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  scale?: number;
  className?: string;
}

const HoverScaleImage: React.FC<HoverScaleImageProps> = ({
  src,
  alt,
  width,
  height,
  scale = 1.1,
  className = '',
}) => {
  return (
    <div
      className={clsx(
        `overflow-hidden w-[${width}px] h-[${width}px]`,
        className
      )}
    >
      <motion.img
        whileHover={{ scale: scale }}
        transition={{ duration: 0.4 }}
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="object-cover"
      />
    </div>
  );
};

export default HoverScaleImage;
