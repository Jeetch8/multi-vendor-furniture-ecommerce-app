'use client';

import { FaGithub, FaGoogle } from 'react-icons/fa';
import { signIn } from 'next-auth/react';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { Button } from '@/components/ui/button';
import { useFormStatus } from 'react-dom';
import { useState } from 'react';

function Socials({ type }: { type: 'login' | 'signup' }) {
  const [selectedProvider, setSelectedProvider] = useState<'google' | 'github'>(
    'github'
  );
  const { pending } = useFormStatus();
  const onClick = (provider: 'google' | 'github') => {
    setSelectedProvider(provider);
    signIn(provider, {
      callbackUrl: DEFAULT_LOGIN_REDIRECT,
    });
  };

  const title = type === 'login' ? 'Login' : 'Signup';

  return (
    <div className="flex flex-col justify-evenly gap-4">
      <div className="flex flex-col gap-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => onClick('github')}
          disabled={pending && selectedProvider === 'github'}
        >
          <FaGithub className="size-4 mr-2" />
          {pending && selectedProvider === 'github'
            ? 'Signing in...'
            : `${title} with Github`}
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => onClick('google')}
          disabled={pending && selectedProvider === 'google'}
        >
          <FaGoogle className="size-4 mr-2" />
          {pending && selectedProvider === 'google'
            ? 'Signing in...'
            : `${title} with Google`}
        </Button>
      </div>
      <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
        <span className="relative z-10 bg-background px-2 text-muted-foreground">
          Or continue with
        </span>
      </div>
    </div>
  );
}

export default Socials;
