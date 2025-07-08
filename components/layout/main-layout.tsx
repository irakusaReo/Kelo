'use client';

import { useEffect, useState } from 'react';
import { SidebarNavigation } from './sidebar-navigation';
import { useCart } from '@/lib/hooks/use-cart';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { items } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-gray-50 dark:bg-gray-900">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <SidebarNavigation cartItemCount={items.length} />
      <main className="flex-1 lg:ml-0">
        {children}
      </main>
    </div>
  );
}