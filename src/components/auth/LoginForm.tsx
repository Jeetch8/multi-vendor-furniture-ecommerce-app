'use client';

import { useSearchParams } from 'next/navigation';
import { useFormState } from 'react-dom';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import * as actions from '@/actions/auth';
import { formatSeconds } from '@/lib/utils';
import Form from '../shared/ui/Form';
import FormError from '../shared/ui/FormError';
import FormSuccess from '../shared/ui/FormSuccess';
import SubmitButton from '../shared/ui/SubmitButton';
import Input from '../shared/ui/Input';
import Socials from '../shared/ui/Socials';
import { Button } from '../ui/button';
import { Label } from '../ui/label';

function LoginForm() {
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [expires, setExpires] = useState<number>();
  let validationErrors;

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const urlError =
    searchParams.get('error') === 'OAuthAccountNotLinked'
      ? 'Email already in use with different provider!'
      : '';
  const [formState, action] = useFormState(actions.login, { errors: {} });

  useEffect(() => {
    if (showTwoFactor && expires && expires > 0) {
      const interval = setInterval(() => {
        setExpires((prevExpires) => {
          if (prevExpires && prevExpires > 0) {
            return prevExpires - 1;
          } else {
            clearInterval(interval);
            return 0;
          }
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [showTwoFactor, expires]);

  if (
    formState?.errors &&
    Object.values(formState?.errors).length > 0 &&
    !formState?.errors._form
  ) {
    validationErrors = Object.values(formState?.errors).map((e) => (
      <FormError key={e[0]}>{e[0]}</FormError>
    ));
  }

  useEffect(() => {
    if (formState?.twoFactor && formState?.expires) {
      setShowTwoFactor(true);
      const remainingSeconds = Math.trunc(
        Number(formState.expires.getTime() - new Date().getTime()) / 1000
      );
      setExpires(remainingSeconds);
    }
  }, [formState?.twoFactor, formState?.expires]);

  return (
    <Form
      action={(formData) => {
        if (showTwoFactor) {
          formData.append('email', email);
          formData.append('password', password);
        }
        return action(formData);
      }}
      className="border-none w-full"
    >
      <Socials type="login" />
      {showTwoFactor && (
        <>
          <Input type="text" id="2FA" name="code" label="2FA Code" />
          {
            <p className="text-center">{`Time remaining: ${
              expires ? formatSeconds(expires) : 'expired'
            }`}</p>
          }
        </>
      )}

      <input type="hidden" value={callbackUrl as string} name="callbackurl" />

      {!showTwoFactor && (
        <>
          <Input
            type="email"
            id="email"
            name="email"
            label="Email"
            className="text-sm"
            onChange={(e) => setEmail(e.target.value)}
          />
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label htmlFor="password">Password</Label>
              <Link className="inline-block underline text-sm" href="/reset">
                Forgot Password?
              </Link>
            </div>
            <input
              className="w-full h-10 rounded-md px-2"
              type="password"
              id="password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </>
      )}

      {validationErrors ? (
        <div className="flex flex-col gap-3">{validationErrors}</div>
      ) : null}
      {formState?.errors?._form ? (
        <FormError>{formState.errors._form[0]}</FormError>
      ) : null}
      {urlError ? <FormError>{urlError}</FormError> : null}
      {formState?.success?.message ? (
        <FormSuccess>{formState?.success?.message}</FormSuccess>
      ) : null}
      <Button className="bg-foreground text-background w-full">
        {showTwoFactor ? 'Confirm' : 'Sign in'}
      </Button>
    </Form>
  );
}

export default LoginForm;
