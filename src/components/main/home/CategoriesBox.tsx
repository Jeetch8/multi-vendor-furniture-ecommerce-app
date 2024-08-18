'use client';

import React, { useState, useEffect, useRef } from 'react';
import img1 from '../../../../public/furniture-environment/image1.webp';
import img2 from '../../../../public/furniture-environment/image2.webp';
import img3 from '../../../../public/furniture-environment/image3.webp';
import img4 from '../../../../public/furniture-environment/image4.webp';
import { motion, useScroll, useTransform } from 'motion/react';
import { BsArrowRight } from 'react-icons/bs';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import CategoryImageDisplay from './CategoryImageDislay';

export const list = [
  { name: 'Tables', imgSrc: img1 },
  { name: 'Sideboards', imgSrc: img2 },
  { name: 'Chairs', imgSrc: img3 },
  { name: 'Stools', imgSrc: img4 },
];

const CategoriesBox = () => {
  const [hoveredIndex, setHoveredIndex] = useState(0);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  // const { scrollYProgress } = useScroll({
  //   target: containerRef,
  //   offset: ['-20% end', 'end start'],
  // });

  // const backgroundColor = useTransform(
  //   scrollYProgress,
  //   [0.3, 0.4, 0.6, 0.7],
  //   ['rgb(255, 255, 255)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(255, 255, 255)']
  // );

  // useEffect(() => {
  //   return backgroundColor.onChange((v) => {
  //     document.body.style.backgroundColor = v;

  //     document.body.style.color = v === 'rgb(0, 0, 0)' ? 'white' : 'black';
  //   });
  // }, [backgroundColor]);

  return (
    <motion.div
      ref={containerRef}
      className="h-[120vh] text-inherit my-auto bg-black text-white"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{
          opacity: 1,
          y: 0,
          color: 'white',
          transition: { duration: 0.5, delay: 0.2 },
        }}
        exit={{ color: 'black' }}
        viewport={{ once: true }}
        className="container mx-auto pt-20"
      >
        <h1 className="text-7xl">Shop By Categories</h1>
        <div className="grid grid-cols-2 gap-20 mt-10">
          <div>
            <ul className="pl-4 pr-6">
              {list.map((el, ind) => {
                const isSelected = hoveredIndex === ind;
                return (
                  <React.Fragment key={el.name + ind}>
                    <motion.li
                      className="flex items-center justify-between mt-8"
                      onHoverStart={() => setHoveredIndex(ind)}
                      onClick={() =>
                        router.push('/category/' + el.name.toLowerCase())
                      }
                    >
                      <motion.h2
                        className="text-6xl cursor-pointer"
                        whileHover={{ x: 10 }}
                        transition={{ duration: 0.2 }}
                      >
                        {el.name}
                      </motion.h2>
                      <motion.div
                        animate={{ rotate: isSelected ? 0 : 45 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                      >
                        <BsArrowRight size={30} />
                      </motion.div>
                    </motion.li>
                    <Separator className="h-[2px] border-current opacity-20" />
                  </React.Fragment>
                );
              })}
            </ul>
          </div>
          <CategoryImageDisplay
            selectedImage={list[hoveredIndex].imgSrc}
            alt={list[hoveredIndex].name}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CategoriesBox;
