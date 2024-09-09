import AccountSettingsForm from '@/components/main/account/AccountSettingsForm';
import MiniSpinner from '@/components/shared/ui/MiniSpinner';
import { auth } from '@/lib/auth';
import { getUserById } from '@/lib/services/user';
import { TUserForAccountSetings } from '@/types/User';

async function AccountSettingsPage() {
  const session = await auth();
  const user = session?.user;

  const userWithStore = await getUserById(user?.id as string);

  if (!user || !userWithStore) {
    return (
      <div>
        <MiniSpinner />
      </div>
    );
  }

  return (
    <div>
      <h3 className="mb-4 text-2xl font-bold">Account Settings</h3>
      <div>
        <AccountSettingsForm user={userWithStore as TUserForAccountSetings} />
      </div>
    </div>
  );
}

export default AccountSettingsPage;
