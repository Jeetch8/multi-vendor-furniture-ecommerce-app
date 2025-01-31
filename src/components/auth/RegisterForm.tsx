'use client';

import { useFormState } from 'react-dom';
import * as actions from '@/actions/auth';
import Form from '../shared/ui/Form';
import FormError from '../shared/ui/FormError';
import FormSuccess from '../shared/ui/FormSuccess';
import Input from '../shared/ui/Input';
import SubmitButton from '../shared/ui/SubmitButton';

function RegisterForm() {
  const [formState, action] = useFormState(actions.register, {
    errors: {},
    success: {},
  });
  let validationErrors: any = [];

  if (formState.errors && !formState.errors._form) {
    validationErrors = Object.values(formState.errors).map((err) => {
      if (err instanceof Array) {
        return err[0];
      }
      return err;
    });
  }

  return (
    <Form action={action} className="border-none text-sm">
      <Input type="text" id="name" name="name" label="Name" />

      <Input type="email" id="email" name="email" label="E-mail" />

      <Input type="password" id="password" name="password" label="Password" />

      <Input
        type="password"
        id="confirmPassword"
        name="confirmPassword"
        label="Confirm Password"
      />

      {validationErrors.length > 0 ? (
        <div className="flex flex-col gap-3 text-sm">
          {validationErrors.map((error: any) => (
            <FormError key={error}>{error}</FormError>
          ))}
        </div>
      ) : null}

      {formState.errors?._form ? (
        <FormError>{formState.errors._form[0]}</FormError>
      ) : null}

      {formState.success?.message ? (
        <FormSuccess>{formState.success.message}</FormSuccess>
      ) : null}

      <SubmitButton className="bg-foreground text-white">
        Create an account
      </SubmitButton>
    </Form>
  );
}

export default RegisterForm;
