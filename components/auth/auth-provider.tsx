'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useGoogleAuth, type GoogleAuthHook } from '@/lib/hooks/use-google-auth';

const AuthContext = createContext<GoogleAuthHook | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useGoogleAuth();

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