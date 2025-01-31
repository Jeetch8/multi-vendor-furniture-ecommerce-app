'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useFormState } from 'react-dom';
import toast from 'react-hot-toast';

import FormError from '@/components/shared/ui/FormError';
import Rating from '@/components/shared/ui/Rating';
import { Separator } from '@/components/ui/separator';
import SubmitButton from '@/components/shared/ui/SubmitButton';
import TextArea from '@/components/shared/ui/TextArea';
// import { ProductWith } from '@/types';
import { createNewReview } from '@/actions/account';
import { useRouter } from 'next/navigation';
import { TProduct, TProductImage } from '@/lib/schema';

function NewReviewForm({
  product,
}: {
  product: TProduct & { images: TProductImage[] };
}) {
  const [rating, setRating] = useState<number>(0);
  const [formState, action] = useFormState(createNewReview, { errors: {} });
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  const resetForm = useCallback(() => {
    if (formRef.current) {
      formRef.current.reset();
    }
  }, []);

  useEffect(() => {
    if (formState.success) {
      resetForm();
      toast.success(formState.success.message as string);

      if (formState.success.revalidated) {
        router.refresh();
      }
    }
  }, [formState.success, resetForm, router]);

  const handleValueChange = (index: any) => {
    setRating(index + 1);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!formRef.current) return;

    const formData = new FormData(formRef.current);

    await action(formData);
  };

  return (
    <div className="flex flex-col gap-3">
      <Separator className="my-2" />
      <div className="flex">
        <div className="relative h-20 flex-[15%]">
          <Image
            src={product.images[0].url}
            alt={product.images[0].alt || 'Product Image'}
            fill
            className="object-contain"
          />
        </div>
        <div className="flex-[85%]">
          <p className="text-gray-custom-1">{product.brand}</p>
          <p className="soft-text">{product.name}</p>
        </div>
      </div>
      <Separator className="my-2" />
      <form
        className="flex flex-col gap-3"
        onSubmit={handleSubmit}
        ref={formRef}
      >
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <p>Rate the product</p>
            <Rating
              editable={true}
              size={5}
              value={rating}
              starHw={{ h: 'h-6', w: 'w-6' }}
              onValueChange={handleValueChange}
            />
          </div>
          {formState.errors?.rating && (
            <FormError>{formState.errors?.rating}</FormError>
          )}
        </div>

        <input type="hidden" value={rating} name="rating" />

        <input type="hidden" value={product.id} name="productId" />

        <Separator className="my-2" />

        <TextArea
          label="Your Comment"
          name="comment"
          error={formState.errors?.comment}
        />
        <SubmitButton>Confirm</SubmitButton>
      </form>
    </div>
  );
}

export default NewReviewForm;
