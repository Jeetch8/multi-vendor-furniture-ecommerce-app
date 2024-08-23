'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface SidebarCategoryItemProps {
  title: string;
  items: string[];
  selectedValues?: string[];
  onSelectionChange?: (values: string[]) => void;
}

function SidebarCategoryItem({
  title,
  items,
  onSelectionChange,
}: SidebarCategoryItemProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  const handleItemClick = (value: string) => {
    const params = new URLSearchParams(searchParams);
    const currentValues = params.get(title)?.split(',') || [];

    let newValues: string[];
    if (currentValues.includes(value)) {
      newValues = currentValues.filter((v) => v !== value);
    } else {
      newValues = [...currentValues, value];
    }

    if (newValues.length) {
      params.set(title, newValues.join(','));
    } else {
      params.delete(title);
    }

    router.push(`${pathname}?${params.toString()}`);
    onSelectionChange?.(newValues);
  };

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    const values = params.get(title)?.split(',') || [];
    setSelectedValues(values);
  }, [searchParams, title]);

  return (
    <AccordionItem
      value={title}
      className="px-4 data-[state=open]:bg-stone-100"
    >
      <AccordionTrigger>
        <div className="flex justify-between items-center gap-2 w-full">
          <span>{title}</span>
          {selectedValues.length > 0 && (
            <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full font-semibold mr-2">
              {selectedValues.length}
            </span>
          )}
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="flex flex-wrap gap-2">
          {items.map((item) => (
            <button
              key={item}
              onClick={() => handleItemClick(item)}
              className={cn(
                'px-3 py-1.5 text-sm rounded-md transition-colors',
                'border border-gray-200 hover:border-gray-300',
                selectedValues.includes(item)
                  ? 'bg-primary font-semibold text-white'
                  : 'bg-background hover:bg-gray-50'
              )}
            >
              {item}
            </button>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

export default SidebarCategoryItem;
