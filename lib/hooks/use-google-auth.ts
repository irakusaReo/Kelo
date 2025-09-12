'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { smartWalletService, type SmartWallet } from '@/lib/wallet/smart-wallet-service';
import { type GoogleUser } from '@/lib/auth/auth-types';

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: GoogleUser | null;
  wallet: SmartWallet | null;
  error: string | null;
}

export interface GoogleAuthHook extends AuthState {
  signInWithGoogle: () => Promise<void>;
  signOut: () => void;
  clearError: () => void;
  refreshWallet: () => Promise<void>;
}

export function useGoogleAuth(): GoogleAuthHook {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    wallet: null,
    error: null,
  });

  /**
   * Check for existing authentication session on component mount
   * Verifies stored token with backend
   */
  useEffect(() => {
    checkExistingSession();
  }, []);

  /**
   * Verify existing session token and restore authentication state
   */
  const checkExistingSession = async () => {
    try {
      const token = localStorage.getItem('kelo_auth_token');
      if (!token) {
        setState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      // Verify token with backend
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const { user, wallet } = await response.json();
        setState({
          isAuthenticated: true,
          isLoading: false,
          user,
          wallet,
          error: null,
        });
      } else {
        localStorage.removeItem('kelo_auth_token');
        setState(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error('Error checking session:', error);
      setState(prev => ({ 
        ...prev, 
        isLoading: false,
        error: 'Failed to verify session'
      }));
    }
  };

  /**
   * Initiate Google sign-in process using popup window
   * Handles popup communication and token storage
   */
  const signInWithGoogle = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Get auth URL from backend
      const authResponse = await fetch('/api/auth/google', {
        method: 'GET',
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Cache-Control': 'no-cache',
        },
        credentials: 'same-origin',
      });

      if (!authResponse.ok) {
        const errorText = await authResponse.text();
        
        // Check if it's an HTML error page
        if (errorText.includes('Configuration Error') || errorText.includes('OAuth configuration error')) {
          throw new Error('Google OAuth is not properly configured. Please check your environment variables.');
        }
        
        throw new Error(`Authentication request failed: ${authResponse.status}`);
      }

      // Get the auth URL from the response
      const authUrl = authResponse.url;
      
      // Open centered popup window
      const popup = window.open(
        authUrl,
        'google-auth',
        'width=500,height=600,scrollbars=yes,resizable=yes,left=' + 
        (window.screen.width / 2 - 250) + ',top=' + (window.screen.height / 2 - 300)
      );

      if (!popup) {
        throw new Error('Failed to open authentication popup. Please allow popups for this site.');
      }

      // Handle popup communication
      const handleMessage = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;
        
        if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
          window.removeEventListener('message', handleMessage);
          popup.close();
          
          if (event.data.token) {
            localStorage.setItem('kelo_auth_token', event.data.token);
          }
          
          setState({
            isAuthenticated: true,
            isLoading: false,
            user: event.data.user,
            wallet: event.data.wallet,
            error: null,
          });
          
          router.push('/marketplace');
        } else if (event.data.type === 'GOOGLE_AUTH_ERROR') {
          window.removeEventListener('message', handleMessage);
          popup.close();
          
          setState(prev => ({ 
            ...prev, 
            isLoading: false,
            error: event.data.error || 'Authentication failed'
          }));
        }
      };
      
      window.addEventListener('message', handleMessage);
      
      // Monitor popup closure
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          window.removeEventListener('message', handleMessage);
          
          if (state.isLoading) {
            setState(prev => ({ 
              ...prev, 
              isLoading: false,
              error: 'Authentication was cancelled'
            }));
          }
        }
      }, 1000);
      
      // Set authentication timeout
      setTimeout(() => {
        if (!popup.closed) {
          popup.close();
          clearInterval(checkClosed);
          window.removeEventListener('message', handleMessage);
          
          setState(prev => ({ 
            ...prev, 
            isLoading: false,
            error: 'Authentication timed out. Please try again.'
          }));
        }
      }, 300000);
      
    } catch (error) {
      console.error('Error during Google sign-in:', error);
      setState(prev => ({ 
        ...prev, 
        isLoading: false,
        error: error instanceof Error ? error.message : 'Authentication failed'
      }));
      throw error;
    }
  }, [router, state.isLoading]);

  /**
   * Sign out user and clear authentication state
   * Calls logout endpoint and clears local storage
   */
  const signOut = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('kelo_auth_token')}`,
        },
      });

      localStorage.removeItem('kelo_auth_token');
      
      setState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        wallet: null,
        error: null,
      });

      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
      setState(prev => ({ 
        ...prev, 
        isLoading: false,
        error: 'Failed to sign out'
      }));
    }
  }, [router]);

  /**
   * Clear current error state
   */
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  /**
   * Refresh wallet information for current user
   */
  const refreshWallet = useCallback(async () => {
    if (!state.user) return;

    try {
      const wallet = await smartWalletService.getWalletByUserId(state.user.id);
      setState(prev => ({ ...prev, wallet }));
    } catch (error) {
    }
  }, [state.user]);

  return {
    ...state,
    signInWithGoogle,
    signOut,
    clearError,
    refreshWallet,
  };
}