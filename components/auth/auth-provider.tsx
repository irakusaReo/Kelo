'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGoogleAuth, type GoogleAuthHook } from '@/lib/hooks/use-google-auth';

const AuthContext = createContext<GoogleAuthHook | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useGoogleAuth();
  const router = useRouter();

  // Handle post-login navigation
  useEffect(() => {
    if (auth.isAuthenticated && !auth.isLoading) {
      // Check if we're on the landing page and redirect to marketplace
      if (window.location.pathname === '/') {
        router.push('/marketplace');
      }
    }
  }, [auth.isAuthenticated, auth.isLoading, router]);

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}