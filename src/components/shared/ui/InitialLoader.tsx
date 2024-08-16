'use client';

import { motion } from 'motion/react';
import PreLoaderImg from '../../../../public/loader-image.png';
import Image from 'next/image';

import React, { useEffect } from 'react';

const PreLoader = () => {
  useEffect(() => {
    document.body.classList.add('no-scroll-bar');

    const timeout = setTimeout(() => {
      document.body.classList.remove('no-scroll-bar');
    }, 3000);

    return () => {
      clearTimeout(timeout);
      document.body.classList.remove('no-scroll-bar');
    };
  }, []);

  return (
    <motion.div
      className="h-screen w-screen bg-black absolute top-0 left-0 z-50 overflow-hidden"
      initial={{ y: 0 }}
      animate={{ y: '-100%', display: 'none' }}
      transition={{ duration: 0.5, delay: 2.5 }}
    >
      <div className="grid place-items-center h-full">
        <motion.div
          animate={{
            rotate: [0, 360, 360, 720],
          }}
          transition={{
            duration: 2,
            times: [0, 0.4, 0.6, 1],
            ease: 'easeInOut',
          }}
        >
          <Image src={PreLoaderImg} alt="preloader" sizes="300px" />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PreLoader;
