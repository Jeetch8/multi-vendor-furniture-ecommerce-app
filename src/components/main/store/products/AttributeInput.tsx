import React, { useEffect, useState } from 'react';

import { Input, MultiSelect } from '@/components/shared/ui';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TProductForTable } from '@/types';
import { SelectedCategories } from './NewProductUpdateForm';
import { InferQueryModel } from '@/utils/QueryTypesBuilder';

type AttributeInputProps = {
  selectedCategories: SelectedCategories[];
  categoriesData: InferQueryModel<"categories", {
    with: {
      categoryToAttributeCategory: {
        with: {
          attributeCategory: true
        }
      }
    }
  }>[];
  onAttributesChange: (attributes: { [key: string]: string }) => void;
  productToEdit?: TProductForTable;
};

function AttributeInput({
  selectedCategories,
  categoriesData,
  onAttributesChange,
  productToEdit,
}: AttributeInputProps) {
  const [attributes, setAttributes] = useState<{
    [key: string]: {
      value: string;
      required: boolean;
      options?: string[];
      type: string;
    };
  }>({});

  const parseOptions = (optionsString: string): string[] => {
    return optionsString
      .replace(/^\[|\]$/g, '')
      .split(',')
      .map((option) => option.trim());
  };

  useEffect(() => {
    const loadAttributes = () => {
      const newAttributes: {
        [key: string]: {
          value: string;
          required: boolean;
          options?: string[];
          type: string;
        };
      } = {};

      const lastCategory = selectedCategories[selectedCategories.length - 1];

      if (lastCategory) {
        const categoryData = categoriesData.find(
          (cat) => cat.id === lastCategory.catId
        );
        if (categoryData && categoryData.categoryToAttributeCategory) {
          categoryData.categoryToAttributeCategory.forEach((attr) => {
            const existingValue =
              productToEdit?.attributes.find(
                (a) => a.attributeCategoryId === attr.attributeCategoryId
              )?.value || '';

            newAttributes[attr.attributeCategoryId] = {
              value: existingValue,
              required: attr.attributeCategory.required ?? false,
              options: attr.attributeCategory.options
                ? parseOptions(attr.attributeCategory.options)
                : undefined,
              type: attr.attributeCategory.type,
            };
          });
        }
      }

      setAttributes(newAttributes);

      const initialAttributes = Object.entries(newAttributes).reduce(
        (acc, [key, { value }]) => {
          acc[key] = value;
          return acc;
        },
        {} as { [key: string]: string }
      );
      onAttributesChange(initialAttributes);
    };

    loadAttributes();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategories, categoriesData, productToEdit]);

  const handleAttributeChange = (attrId: string, value: string | string[]) => {
    const newValue = Array.isArray(value) ? value.join(',') : value;
    setAttributes((prev) => ({
      ...prev,
      [attrId]: { ...prev[attrId], value: newValue },
    }));

    const updatedAttributes = Object.entries(attributes).reduce(
      (acc, [key, { value }]) => {
        acc[key] = value;
        return acc;
      },
      {} as { [key: string]: string }
    );
    updatedAttributes[attrId] = newValue;

    onAttributesChange(updatedAttributes);
  };

  return (
    <div>
      <label>Product Attributes</label>
      {Object.entries(attributes).map(
        ([attrId, { value, required, options, type }]) => {
          const attribute = categoriesData
            .flatMap((cat) => cat.categoryToAttributeCategory || [])
            .find((attr) => attr.attributeCategory.id === attrId);

          if (!attribute) return null;

          if (type === 'multi-select' && options) {
            return (
              <div key={attrId} className="mb-4 flex flex-col gap-2">
                <label>{attribute.attributeCategory.name}</label>
                <MultiSelect
                  attrId={attrId}
                  options={options}
                  value={value}
                  onChange={(newValue: any) =>
                    handleAttributeChange(attrId, newValue)
                  }
                />
              </div>
            );
          } else if (options) {
            return (
              <div key={attrId} className="mb-4 flex flex-col gap-2">
                <label>{attribute.attributeCategory.name}</label>
                <Select
                  onValueChange={(value) =>
                    handleAttributeChange(attrId, value)
                  }
                  value={value || undefined}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={`Select ${attribute.attributeCategory.name}`}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {options.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            );
          } else {
            return (
              <div key={attrId} className="mb-4 flex flex-col gap-2">
                <Input
                  type="text"
                  id={`attr-${attrId}`}
                  name={`attr-${attrId}`}
                  label={attribute.attributeCategory.name}
                  value={value}
                  onChange={(e) =>
                    handleAttributeChange(attrId, e.target.value)
                  }
                />
              </div>
            );
          }
        }
      )}
    </div>
  );
}

export default AttributeInput;
