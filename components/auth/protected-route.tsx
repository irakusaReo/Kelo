'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthGuard } from './auth-guard';
import { authService } from '@/lib/auth/auth-service';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireWallet?: boolean;
  requireKYC?: boolean;
  redirectTo?: string;
  fallback?: React.ReactNode;
}

interface UserStatus {
  isAuthenticated: boolean;
  hasWallet: boolean;
  isKYCComplete: boolean;
  isLoading: boolean;
  user: any;
  wallet: any;
}

export function ProtectedRoute({ 
  children, 
  requireAuth = true,
  requireWallet = false,
  requireKYC = false,
  redirectTo,
  fallback
}: ProtectedRouteProps) {
  const router = useRouter();
  const [userStatus, setUserStatus] = useState<UserStatus>({
    isAuthenticated: false,
    hasWallet: false,
    isKYCComplete: false,
    isLoading: true,
    user: null,
    wallet: null,
  });

  useEffect(() => {
    checkUserStatus();
  }, []);

  const checkUserStatus = async () => {
    try {
      const token = authService.getStoredToken();
      
      if (!token) {
        setUserStatus(prev => ({ ...prev, isLoading: false }));
        return;
      }

      const session = await authService.verifyAuthentication(token);
      
      if (!session) {
        authService.clearToken();
        setUserStatus(prev => ({ ...prev, isLoading: false }));
        return;
      }

      setUserStatus({
        isAuthenticated: true,
        hasWallet: !!session.walletAddress,
        isKYCComplete: session.user?.kycStatus === 'approved',
        isLoading: false,
        user: session.user,
        wallet: session.wallet,
      });

    } catch (error) {
      console.error('Failed to check user status:', error);
      setUserStatus(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Determine redirect path based on requirements
  const getRedirectPath = () => {
    if (!userStatus.isAuthenticated) {
      return '/';
    }
    if (requireWallet && !userStatus.hasWallet) {
      return '/onboarding';
    }
    if (requireKYC && !userStatus.isKYCComplete) {
      return '/onboarding';
    }
    return redirectTo || '/dashboard';
  };

  // Check if user meets all requirements
  const meetsRequirements = () => {
    if (requireAuth && !userStatus.isAuthenticated) return false;
    if (requireWallet && !userStatus.hasWallet) return false;
    if (requireKYC && !userStatus.isKYCComplete) return false;
    return true;
  };

  // Show loading state
  if (userStatus.isLoading) {
    return fallback || <AuthGuard requireAuth={false}><div>Loading...</div></AuthGuard>;
  }

  // Redirect if requirements not met
  if (!meetsRequirements()) {
    const redirectPath = getRedirectPath();
    
    if (redirectPath !== window.location.pathname) {
      router.push(redirectPath);
      return fallback || <div>Redirecting...</div>;
    }
  }

  // Requirements met - show children
  return (
    <AuthGuard requireAuth={requireAuth}>
      {children}
    </AuthGuard>
  );
}