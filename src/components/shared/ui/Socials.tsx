'use client';

import { FaGithub, FaGoogle } from 'react-icons/fa';
import { signIn } from 'next-auth/react';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { Button } from '@/components/ui/button';
import { useFormStatus } from 'react-dom';
import { useState } from 'react';

function Socials({ type }: { type: 'login' | 'signup' }) {
  const [selectedProvider, setSelectedProvider] = useState<
    'google' | 'github' | undefined
  >(undefined);
  const { pending } = useFormStatus();
  const onClick = (provider: 'google' | 'github') => {
    setSelectedProvider(provider);
    signIn(provider, {
      callbackUrl: DEFAULT_LOGIN_REDIRECT,
    });
    setSelectedProvider(undefined);
  };

  const isGooglePending = pending && selectedProvider === 'google';
  const isGithubPending = pending && selectedProvider === 'github';

  const title = type === 'login' ? 'Login' : 'Signup';

  return (
    <div className="flex flex-col justify-evenly gap-4">
      <div className="flex flex-col gap-4">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => onClick('github')}
          disabled={isGithubPending}
        >
          <FaGithub className="size-4 mr-2" />
          {isGithubPending ? 'Signing in...' : `${title} with Github`}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => onClick('google')}
          disabled={isGooglePending}
        >
          <FaGoogle className="size-4 mr-2" />
          {isGooglePending ? 'Signing in...' : `${title} with Google`}
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
