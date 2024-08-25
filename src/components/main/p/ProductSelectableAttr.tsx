'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ProductSelectableAttrProps {
  categoryAttribute: {
    attName: string;
    val: string[];
  };
  onSelect: (attributeName: string, value: string) => void;
  selectedValue?: string;
}

const ProductSelectableAttr = ({
  categoryAttribute,
  onSelect,
  selectedValue,
}: ProductSelectableAttrProps) => {
  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">
        {categoryAttribute.attName}
      </p>
      <Select
        value={selectedValue}
        onValueChange={(value) => onSelect(categoryAttribute.attName, value)}
      >
        <SelectTrigger className="w-full">
          <SelectValue
            placeholder={`Select ${categoryAttribute.attName.toLowerCase()}`}
          />
        </SelectTrigger>
        <SelectContent>
          {categoryAttribute.val.map((value) => (
            <SelectItem key={value} value={value}>
              {value}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ProductSelectableAttr;
