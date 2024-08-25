import React from 'react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { motion } from 'framer-motion';
import { fetchProductBySlug } from '@/lib/services/product';

interface Props {
  product: Awaited<ReturnType<typeof fetchProductBySlug>>;
}

const ProductDetailsAccordion = ({ product }: Props) => {
  return (
    <div className="mt-8 max-w-xl space-y-4">
      <Accordion type="multiple" className="w-full">
        <AccordionItem value="description">
          <AccordionTrigger className="text-base font-semibold">
            Description
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-gray-600">{product?.description}</p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="details-1">
          <AccordionTrigger className="text-base font-semibold">
            Details
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-gray-600">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam
              nihil enim maxime corporis cumque totam aliquid nam sint inventore
              optio modi neque laborum officiis necessitatibus, facilis placeat
              pariatur!
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="details-2">
          <AccordionTrigger className="text-base font-semibold">
            Additional Information
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-gray-600">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam
              nihil enim maxime corporis cumque totam aliquid nam sint inventore
              optio modi neque laborum officiis necessitatibus, facilis placeat
              pariatur!
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default ProductDetailsAccordion;
