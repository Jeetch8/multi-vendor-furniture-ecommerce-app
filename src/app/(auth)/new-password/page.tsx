import NewPasswordForm from '@/components/auth/NewPasswordForm';
import { Suspense } from 'react';
import MiniSpinner from '@/components/shared/ui/MiniSpinner';

function NewPasswordPage() {
  return (
    <div>
      <div className="mx-auto mt-10 w-[450px]">
        <Suspense
          fallback={
            <p>
              <MiniSpinner />
            </p>
          }
        >
          <NewPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}

export default NewPasswordPage;
