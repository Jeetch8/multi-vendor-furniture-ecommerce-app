'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useFormState } from 'react-dom';
import Form from '@/components/shared/ui/Form';
import FormError from '@/components/shared/ui/FormError';
import FormSuccess from '@/components/shared/ui/FormSuccess';
import Input from '@/components/shared/ui/Input';
import SubmitButton from '@/components/shared/ui/SubmitButton';
import TextArea from '@/components/shared/ui/TextArea';
import { newApplication } from '@/actions/store';
import { UploadDropzone } from '@/lib/uploadthing';
import toast from 'react-hot-toast';
import Image from 'next/image';

function ApplicationForm() {
  const [formState, action] = useFormState(newApplication, {
    errors: {},
  });
  const [uploadedImage, setUploadedImage] = useState<string[]>([]);
  const formRef = useRef<HTMLFormElement>(null);

  const resetForm = useCallback(() => {
    if (formRef.current) {
      formRef.current.reset();
    }
  }, []);

  useEffect(() => {
    if (formState.success) {
      resetForm();
    }
  }, [formState.success, resetForm]);

  return (
    <div>
      <h3 className="text-2xl font-bold">Store Application Form</h3>
      <Form ref={formRef} action={action} className="border-none">
        <div className="flex flex-col gap-2">
          <Input
            type="text"
            name="cellphone"
            id="cellphone"
            label="Cell Phone"
          />
          {formState.errors?.cellphone && (
            <FormError>{formState.errors?.cellphone}</FormError>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Input type="text" name="address" id="address" label="Address" />
          {formState.errors?.address && (
            <FormError>{formState.errors?.address}</FormError>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Input
            type="text"
            name="storename"
            id="storename"
            label="Store Name"
          />
          {formState.errors?.storename && (
            <FormError>{formState.errors?.storename}</FormError>
          )}
        </div>

        <input type="hidden" name="img" value={uploadedImage} />

        <div className="flex flex-col gap-2">
          <TextArea name="description" id="description" label="Description" />
          {formState.errors?.description && (
            <FormError>{formState.errors?.description}</FormError>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <UploadDropzone
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              res.forEach((file) => {
                setUploadedImage((prev) => [...prev, file.url]);
              });
            }}
            onUploadError={(error: Error) => {
              toast.error('Something went wrong');
            }}
          />
          <div className="flex flex-col gap-2">
            {uploadedImage.map((image, ind) => (
              <Image
                key={'preview-image-' + ind}
                src={image}
                alt="uploaded image"
                width={100}
                height={100}
              />
            ))}
          </div>
          {formState.errors?.img && (
            <FormError>{formState.errors?.img}</FormError>
          )}
        </div>

        {formState.errors?._form && (
          <FormError>{formState.errors?._form}</FormError>
        )}
        {formState.success && (
          <FormSuccess>{formState.success.message}</FormSuccess>
        )}
        <SubmitButton>Apply</SubmitButton>
      </Form>
    </div>
  );
}

export default ApplicationForm;
