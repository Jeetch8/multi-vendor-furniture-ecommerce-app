'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useFormState } from 'react-dom';

import * as actions from '@/actions/products';
import {
  Form,
  FormError,
  FormSuccess,
  Input,
  SubmitButton,
  TextArea,
} from '@/components/shared/ui';
import { UploadDropzone } from '@/lib/uploadthing';
import { TProductForTable } from '@/types';
import AttributeInput from './AttributeInput';
import HierarchicalCategorySelector from './HierarchicalCategorySelector';
import { toast } from 'react-hot-toast';
import { TProductImage } from '@/lib/schema';
import { InferQueryModel } from '@/utils/QueryTypesBuilder';

type NewProductFormProps = {
  categoriesData: InferQueryModel<"categories", {
    with: {
      categoryToAttributeCategory: {
        with: {
          attributeCategory: true
        }
      },
      subCategories: true
    }
  }>[];
  productToEdit?: TProductForTable;
};

export type SelectedCategories = {
  catId: string;
  catSlug: string;
  catName: string;
};

function attributeFormatter(inputData: any) {
  return Object.entries(inputData).map(([category_id, value]) => ({
    attributeCategoryId: category_id as string,
    value: value as string,
  }));
}

function NewProductUpdateForm({
  categoriesData,
  productToEdit,
}: NewProductFormProps) {
  const [selectedCategories, setSelectedCategories] = useState<
    SelectedCategories[] | []
  >([]);
  const [uploadedImagesUrls, setUploadedImageUrls] = useState<string[]>([]);
  const [productAttributes, setProductAttributes] = useState<{
    [key: string]: string;
  }>({});

  const formRef = useRef<HTMLFormElement>(null);
  const isEditMode = !!productToEdit;

  const mainCategories = useMemo(() => {
    return categoriesData.filter((cat) => cat.parentId === null);
  }, [categoriesData]);

  useEffect(() => {
    if (isEditMode && productToEdit) {
      const editProductCategories = productToEdit.categoryToProducts.map(
        (cat) => ({
          catId: cat.category.id,
          catName: cat.category.name,
          catSlug: cat.category.slug,
        })
      );

      setSelectedCategories(editProductCategories);

      let existsAttributes: { [key: string]: string } = {};
      productToEdit.attributes.forEach(
        (a) => (existsAttributes[a.attributeCategoryId] = a.value)
      );

      setProductAttributes(existsAttributes);

      const imageUrls = productToEdit.images.map(
        (img: TProductImage) => img.url
      );

      setUploadedImageUrls(imageUrls);
    }
  }, [isEditMode, productToEdit]);

  const [formState, action] = useFormState(
    isEditMode
      ? actions.editProduct.bind(null, {
        images: uploadedImagesUrls,
        categories: selectedCategories,
        productId: productToEdit.id,
        attributes: attributeFormatter(productAttributes),
      })
      : actions.createNewProduct.bind(null, {
        images: uploadedImagesUrls,
        categories: selectedCategories,
        attributes: attributeFormatter(productAttributes),
      }),
    {
      errors: {},
    }
  );

  // reset form
  const resetForm = useCallback(() => {
    if (formRef.current) {
      formRef.current.reset();

      setUploadedImageUrls([]);
    }
  }, []);

  useEffect(() => {
    if (formState.success && !isEditMode) {
      resetForm();
    }

    if (formState.success && formState.success.message && isEditMode) {
      resetForm();
    }
  }, [formState.success, resetForm, isEditMode]);

  const handleCategoryChange = ({
    catId,
    catSlug,
    catName,
  }: SelectedCategories) => {
    let newCategory = { catId: catId, catSlug: catSlug, catName: catName };
    if (selectedCategories.some((scat) => scat.catId === catId)) {
      const newSelectedCategories = selectedCategories.filter(
        (scat) => scat.catId !== catId
      );
      setSelectedCategories(newSelectedCategories);
    } else {
      setSelectedCategories([...selectedCategories, newCategory]);
    }
  };

  const handleDeleteCategories = () => {
    setSelectedCategories([]);
  };

  const handleAttributesChange = (newAttributes: { [key: string]: string }) => {
    setProductAttributes(newAttributes);
  };

  const lastSelectedCategory =
    selectedCategories[selectedCategories.length - 1];

  const hasSubcategories = () => {
    if (!lastSelectedCategory) return false;
    const categoryData = categoriesData.find(
      (cat) => cat.id === lastSelectedCategory.catId
    );
    return categoryData?.subCategories && categoryData.subCategories.length > 0;
  };

  return (
    <Form ref={formRef} action={action}>
      <Input
        type="text"
        id="name"
        name="name"
        label="Product Name"
        defaultValue={isEditMode ? productToEdit?.name : ''}
        error={formState.errors?.name}
      />

      <div className="flex flex-col gap-2">
        <TextArea
          id="description"
          name="description"
          label="Description"
          defaultValue={isEditMode ? productToEdit?.description : ''}
        />
        {formState.errors?.description && (
          <FormError>{formState.errors?.description}</FormError>
        )}
      </div>

      <Input
        type="text"
        id="summary"
        name="summary"
        label="Summary"
        defaultValue={isEditMode ? productToEdit?.summary : ''}
        error={formState.errors?.summary}
      />

      <Input
        type="number"
        id="price"
        name="price"
        label="Price"
        step={0.01}
        defaultValue={isEditMode ? productToEdit?.price : ''}
        error={formState.errors?.price}
      />

      <Input
        type="number"
        id="stock"
        name="stock"
        label="Stock"
        defaultValue={isEditMode ? productToEdit?.stock : ''}
        error={formState.errors?.stock}
      />

      <Input
        type="string"
        id="brand"
        name="brand"
        label="Brand"
        defaultValue={isEditMode ? productToEdit?.brand : ''}
        error={formState.errors?.brand}
      />

      <div className="flex flex-col gap-2">
        <label>Category</label>
        <HierarchicalCategorySelector
          mainCategories={mainCategories}
          onCategoryChange={handleCategoryChange}
          selectedCategories={selectedCategories}
          onDeleteCategories={handleDeleteCategories}
        />
      </div>

      <div>
        {(!hasSubcategories() || isEditMode) && (
          <AttributeInput
            selectedCategories={selectedCategories}
            categoriesData={categoriesData}
            onAttributesChange={handleAttributesChange}
            productToEdit={productToEdit}
          />
        )}
      </div>

      <div className="flex flex-col gap-2">
        <UploadDropzone
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            res.forEach((file) => {
              setUploadedImageUrls((prev) => [...prev, file.url]);
            });
          }}
          onUploadError={(error: Error) => {
            toast.error('Something went wrong');
          }}
        />
        {formState.errors?.image && (
          <FormError>{formState.errors?.image}</FormError>
        )}
      </div>

      {formState.success?.message && (
        <FormSuccess>{formState.success.message}</FormSuccess>
      )}

      <div className="mx-auto flex w-64 flex-col">
        <SubmitButton>
          {isEditMode ? 'Edit Product' : 'Create Product'}
        </SubmitButton>
      </div>
    </Form>
  );
}

export default NewProductUpdateForm;
