'use client';

import { usePathname } from 'next/navigation';
import Container from '@/components/shared/ui/Container';
import LinkUnderlined from '@/components/shared/Animated/LinkUnderlined';
import * as React from 'react';
import { X, ChevronDown } from 'lucide-react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { cn } from '@/lib/utils';

type NavLink = {
  name: string;
  href: string;
};

type PageProps = {
  navItems: NavLink[];
};

function UserAccountNavigation({ navItems }: PageProps) {
  const pathname = usePathname();

  return (
    <nav className={`h-full border-b-2 border-gray-200`}>
      <Container>
        <ul className={`md:flex gap-8 py-6 px-6 hidden uppercase`}>
          {navItems.map((link) => (
            <li key={link.name}>
              <LinkUnderlined
                href={link.href}
                className={cn(
                  pathname === link.href
                    ? 'font-semibold'
                    : 'font-normal text-md uppercase'
                )}
                initialUnderlined={pathname === link.href}
              >
                {link.name}
              </LinkUnderlined>
            </li>
          ))}
        </ul>
        <div className="md:hidden">
          <Drawer>
            <DrawerTrigger
              asChild
              className="flex items-center justify-center h-12"
            >
              <button className="mx-auto border-0 flex items-center gap-2">
                {pathname.split('/').pop()?.toUpperCase() || 'ORDERS'}
                <ChevronDown size={18} />
              </button>
            </DrawerTrigger>
            <DrawerContent>
              <div className="w-full">
                <DrawerHeader>
                  <DrawerTitle className="flex items-center justify-between border-b-2 border-gray-200 pb-4">
                    <span></span>
                    <span className="text-lg font-semibold">Account</span>
                    <DrawerClose>
                      <X />
                    </DrawerClose>
                  </DrawerTitle>
                </DrawerHeader>
                <ul className={`text-center mt-4 uppercase`}>
                  {navItems.map((link) => (
                    <li key={link.name} className="w-full text-lg py-2">
                      <LinkUnderlined
                        href={link.href}
                        className={cn(
                          pathname === link.href
                            ? 'font-semibold'
                            : 'font-normal'
                        )}
                        initialUnderlined={pathname === link.href}
                      >
                        {link.name}
                      </LinkUnderlined>
                    </li>
                  ))}
                </ul>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </Container>
    </nav>
  );
}

export default UserAccountNavigation;
