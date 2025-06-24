'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AuthFlow } from './auth-flow';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle,
  Loader2,
  Lock
} from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

interface AuthStatus {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any;
  wallet: any;
  error: string | null;
}

export function AuthGuard({ children, requireAuth = true, redirectTo = '/onboarding' }: AuthGuardProps) {
  const router = useRouter();
  const [authStatus, setAuthStatus] = useState<AuthStatus>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    wallet: null,
    error: null,
  });
  const [showAuthFlow, setShowAuthFlow] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('kelo_auth_token');
      
      if (!token) {
        setAuthStatus(prev => ({ 
          ...prev, 
          isLoading: false,
          isAuthenticated: false 
        }));
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
        const data = await response.json();
        setAuthStatus({
          isAuthenticated: true,
          isLoading: false,
          user: data.user,
          wallet: data.wallet,
          error: null,
        });
      } else {
        // Invalid token
        localStorage.removeItem('kelo_auth_token');
        setAuthStatus(prev => ({ 
          ...prev, 
          isLoading: false,
          isAuthenticated: false,
          error: 'Session expired. Please sign in again.'
        }));
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setAuthStatus(prev => ({ 
        ...prev, 
        isLoading: false,
        error: 'Failed to verify authentication status'
      }));
    }
  };

  const handleAuthComplete = (result: any) => {
    if (result.success) {
      // Store token
      if (result.token) {
        localStorage.setItem('kelo_auth_token', result.token);
      }
      
      // Update auth status
      setAuthStatus({
        isAuthenticated: true,
        isLoading: false,
        user: result.user,
        wallet: result.wallet,
        error: null,
      });

      setShowAuthFlow(false);
      
      // Redirect to next step
      router.push(redirectTo);
    } else {
      setAuthStatus(prev => ({
        ...prev,
        error: result.error || 'Authentication failed'
      }));
      setShowAuthFlow(false);
    }
  };

  const handleAuthCancel = () => {
    setShowAuthFlow(false);
  };

  const handleRetryAuth = () => {
    setAuthStatus(prev => ({ ...prev, error: null }));
    setShowAuthFlow(true);
  };

  // Loading state
  if (authStatus.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-0 shadow-xl">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Checking Authentication</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              Please wait while we verify your session...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show auth flow if needed
  if (showAuthFlow) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <AuthFlow onComplete={handleAuthComplete} onCancel={handleAuthCancel} />
      </div>
    );
  }

  // Not authenticated and auth required
  if (requireAuth && !authStatus.isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-0 shadow-xl">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-xl">Authentication Required</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-center text-gray-600 dark:text-gray-300">
              You need to sign in to access this page. Your account will be secured with 
              Google authentication and a smart wallet.
            </p>

            {authStatus.error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{authStatus.error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-3">
              <Button
                onClick={() => setShowAuthFlow(true)}
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                Sign In with Google
              </Button>
              
              {authStatus.error && (
                <Button
                  onClick={handleRetryAuth}
                  variant="outline"
                  className="w-full"
                >
                  Try Again
                </Button>
              )}
            </div>

            <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-green-800 dark:text-green-200">
                  <p className="font-medium mb-1">Secure & Fast</p>
                  <p>
                    Sign in takes less than 30 seconds and creates a secure smart wallet automatically.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Authenticated or auth not required - show children
  return <>{children}</>;
}