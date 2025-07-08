'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/components/auth/auth-provider';
import { 
  ShoppingCart, 
  LayoutDashboard, 
  Store, 
  CreditCard, 
  Calendar, 
  Vault, 
  History, 
  User, 
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Home,
  Wallet,
  TrendingUp
} from 'lucide-react';

interface SidebarNavigationProps {
  cartItemCount?: number;
}

export function SidebarNavigation({ cartItemCount = 0 }: SidebarNavigationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navigationItems = [
    {
      label: 'Marketplace',
      icon: Store,
      href: '/marketplace',
      description: 'Browse and shop products',
    },
    {
      label: 'Cart',
      icon: ShoppingCart,
      href: '/cart',
      description: 'View your cart items',
      badge: cartItemCount > 0 ? cartItemCount : undefined,
    },
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      href: '/dashboard',
      description: 'Overview and analytics',
    },
    {
      label: 'BNPL Payments',
      icon: CreditCard,
      href: '/dashboard?tab=payments',
      description: 'Manage your payments',
    },
    {
      label: 'Payment Schedule',
      icon: Calendar,
      href: '/dashboard?tab=schedule',
      description: 'View payment timeline',
    },
    {
      label: 'Savings Vault',
      icon: Vault,
      href: '/dashboard?tab=vault',
      description: 'Earn yield on savings',
    },
    {
      label: 'Transaction History',
      icon: History,
      href: '/dashboard?tab=history',
      description: 'View all transactions',
    },
    {
      label: 'Profile',
      icon: User,
      href: '/dashboard?tab=profile',
      description: 'Manage your profile',
    },
  ];

  const handleNavigation = (href: string) => {
    router.push(href);
    setIsMobileOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const isActive = (href: string) => {
    if (href === '/marketplace') return pathname === '/marketplace';
    if (href === '/cart') return pathname === '/cart';
    if (href === '/dashboard') return pathname === '/dashboard' || pathname.startsWith('/dashboard');
    return pathname === href;
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">K</span>
            </div>
            {!isCollapsed && (
              <span className="text-xl font-bold text-gray-900 dark:text-white">Kelo</span>
            )}
          </div>
          
          {/* Desktop collapse toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex w-8 h-8 p-0"
          >
            <ChevronRight className={`w-4 h-4 transition-transform ${isCollapsed ? '' : 'rotate-180'}`} />
          </Button>
          
          {/* Mobile close button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden w-8 h-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* User Info */}
      {user && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user.name || 'User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user.email}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navigationItems.map((item) => (
          <Button
            key={item.href}
            variant={isActive(item.href) ? "default" : "ghost"}
            className={`w-full justify-start h-auto p-3 ${
              isActive(item.href) 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            onClick={() => handleNavigation(item.href)}
          >
            <div className="flex items-center space-x-3 w-full">
              <item.icon className={`w-5 h-5 flex-shrink-0 ${
                isActive(item.href) ? 'text-white' : 'text-gray-500 dark:text-gray-400'
              }`} />
              {!isCollapsed && (
                <>
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{item.label}</span>
                      {item.badge && (
                        <Badge className="bg-red-500 text-white text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                    <p className={`text-xs mt-1 ${
                      isActive(item.href) 
                        ? 'text-green-100' 
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {item.description}
                    </p>
                  </div>
                </>
              )}
            </div>
          </Button>
        ))}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start h-auto p-3"
          onClick={() => handleNavigation('/settings')}
        >
          <Settings className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
          {!isCollapsed && (
            <span className="ml-3 font-medium">Settings</span>
          )}
        </Button>
        
        <Button
          variant="ghost"
          className="w-full justify-start h-auto p-3 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
          onClick={handleSignOut}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && (
            <span className="ml-3 font-medium">Sign Out</span>
          )}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-white dark:bg-gray-800 shadow-md"
      >
        <Menu className="w-5 h-5" />
      </Button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-80'
      }`}>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <aside className={`lg:hidden fixed left-0 top-0 h-full w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 z-50 transform transition-transform duration-300 ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <SidebarContent />
      </aside>
    </>
  );
}