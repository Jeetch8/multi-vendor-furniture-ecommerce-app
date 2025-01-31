import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { LuUser } from 'react-icons/lu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useCurrentUser } from '@/hooks/use-current-user';
import { signOut } from 'next-auth/react';
import LinkUnderlined from '@/components/shared/Animated/LinkUnderlined';
import ThemeTogglerBtn from '@/components/shared/ui/ThemeTogglerBtn';

const UserDisplay = () => {
  const user = useCurrentUser();

  if (!user) {
    return (
      <div className="flex items-center gap-1">
        <LuUser size={20} />
        <LinkUnderlined href="/auth/signin">LOGIN</LinkUnderlined>
      </div>
    );
  }

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="flex items-center gap-1 cursor-pointer">
          <LuUser size={20} />
          <LinkUnderlined href="/account">ACCOUNT</LinkUnderlined>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-fit">
        <div className="flex justify-between space-x-4 items-start">
          <Avatar>
            <AvatarImage src={user.image ?? ''} />
            <AvatarFallback>
              {user.name?.charAt(0).toUpperCase() ?? 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">{user.name}</h4>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <div className="flex flex-col gap-1 pt-2">
              {user?.role! === 'STORE_OWNER' && (
                <LinkUnderlined
                  href="/dashboard"
                  className="text-sm text-primary"
                >
                  Dashboard
                </LinkUnderlined>
              )}
              <LinkUnderlined href="/account" className="text-sm w-fit">
                Account Settings
              </LinkUnderlined>
              <LinkUnderlined href="/orders" className="text-sm w-fit">
                Orders
              </LinkUnderlined>
              <LinkUnderlined href="/favorites" className="text-sm w-fit">
                Favorites
              </LinkUnderlined>
              <LinkUnderlined
                className="text-sm w-fit"
                onClick={(e) => {
                  e.preventDefault();
                  signOut({ redirectTo: '/auth/signin' });
                }}
              >
                Sign Out
              </LinkUnderlined>
            </div>
          </div>
          <ThemeTogglerBtn />
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default UserDisplay;
