import ResetForm from '@/components/auth/ResetForm';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

function ResetPasswordPage() {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Reset Password</CardTitle>
        <CardDescription>
          Enter your email to reset your password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResetForm />
        <div className="mt-6 text-center text-sm">
          Remember your password?{' '}
          <a
            href="/signin"
            className="underline underline-offset-4 hover:text-primary"
          >
            Sign in
          </a>
        </div>
      </CardContent>
    </Card>
  );
}

export default ResetPasswordPage;
