import { LoginForm } from '@/components/auth';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import Link from 'next/link';

function SignInPage() {
  return (
    <div
      className={cn(
        'flex flex-col gap-6 shadow-md rounded-xl overflow-hidden bg-background'
      )}
    >
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Login with your Github or Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
          <div className="text-center text-sm mt-4">
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" className="underline underline-offset-4">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default SignInPage;
