'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Chrome, 
  Shield, 
  Wallet, 
  CheckCircle, 
  AlertTriangle,
  Loader2,
  Lock,
  Zap,
  X,
  User,
  Key,
  Database
} from 'lucide-react';

interface AuthFlowProps {
  onComplete: (authData: AuthenticationResult) => void;
  onCancel: () => void;
}

interface AuthenticationResult {
  success: boolean;
  user?: {
    id: string;
    email: string;
    name: string;
    picture?: string;
  };
  wallet?: {
    id: string;
    address: string;
    isActive: boolean;
  };
  token?: string;
  error?: string;
}

interface AuthState {
  step: 'idle' | 'authenticating' | 'creating-wallet' | 'verifying' | 'complete' | 'error';
  progress: number;
  message: string;
  error?: string;
}

export function AuthFlow({ onComplete, onCancel }: AuthFlowProps) {
  const [authState, setAuthState] = useState<AuthState>({
    step: 'idle',
    progress: 0,
    message: 'Ready to start authentication',
  });

  const [authWindow, setAuthWindow] = useState<Window | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  // Cleanup auth window on unmount
  useEffect(() => {
    return () => {
      if (authWindow && !authWindow.closed) {
        authWindow.close();
      }
    };
  }, [authWindow]);

  // Listen for authentication messages
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
        handleAuthSuccess(event.data);
      } else if (event.data.type === 'GOOGLE_AUTH_ERROR') {
        handleAuthError(event.data.error);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const startAuthentication = async () => {
    try {
      setAuthState({
        step: 'authenticating',
        progress: 10,
        message: 'Opening Google authentication...',
      });

      // Open Google OAuth popup
      const authUrl = '/api/auth/google?popup=true';
      const popup = window.open(
        authUrl,
        'google-auth',
        'width=500,height=600,scrollbars=yes,resizable=yes,left=' + 
        (window.screen.width / 2 - 250) + ',top=' + (window.screen.height / 2 - 300)
      );

      if (!popup) {
        throw new Error('Failed to open authentication popup. Please allow popups for this site.');
      }

      setAuthWindow(popup);

      // Update progress while waiting
      setAuthState(prev => ({
        ...prev,
        progress: 25,
        message: 'Waiting for Google authentication...',
      }));

      // Check if popup was closed manually
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          if (authState.step === 'authenticating') {
            handleAuthError('Authentication was cancelled by user');
          }
        }
      }, 1000);

      // Timeout after 5 minutes
      setTimeout(() => {
        if (!popup.closed && authState.step === 'authenticating') {
          popup.close();
          handleAuthError('Authentication timed out. Please try again.');
        }
        clearInterval(checkClosed);
      }, 300000);

    } catch (error) {
      handleAuthError(error instanceof Error ? error.message : 'Failed to start authentication');
    }
  };

  const handleAuthSuccess = async (data: any) => {
    try {
      // Close auth window
      if (authWindow && !authWindow.closed) {
        authWindow.close();
      }

      setAuthState({
        step: 'creating-wallet',
        progress: 50,
        message: 'Authentication successful! Creating your wallet...',
      });

      // Simulate wallet creation process
      await new Promise(resolve => setTimeout(resolve, 1500));

      setAuthState(prev => ({
        ...prev,
        progress: 75,
        message: 'Setting up security features...',
      }));

      await new Promise(resolve => setTimeout(resolve, 1500));

      setAuthState({
        step: 'verifying',
        progress: 90,
        message: 'Verifying account setup...',
      });

      // Verify the authentication with backend
      const verifyResponse = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${data.token}`,
        },
      });

      if (!verifyResponse.ok) {
        throw new Error('Failed to verify authentication');
      }

      const verificationData = await verifyResponse.json();

      setAuthState({
        step: 'complete',
        progress: 100,
        message: 'Account setup complete!',
      });

      // Wait a moment before completing
      setTimeout(() => {
        onComplete({
          success: true,
          user: verificationData.user,
          wallet: verificationData.wallet,
          token: data.token,
        });
      }, 1000);

    } catch (error) {
      handleAuthError(error instanceof Error ? error.message : 'Failed to complete authentication');
    }
  };

  const handleAuthError = (error: string) => {
    console.error('Authentication error:', error);
    
    // Close auth window if open
    if (authWindow && !authWindow.closed) {
      authWindow.close();
    }

    setAuthState({
      step: 'error',
      progress: 0,
      message: 'Authentication failed',
      error,
    });
  };

  const handleRetry = () => {
    if (retryCount >= maxRetries) {
      onComplete({
        success: false,
        error: 'Maximum retry attempts exceeded. Please try again later.',
      });
      return;
    }

    setRetryCount(prev => prev + 1);
    setAuthState({
      step: 'idle',
      progress: 0,
      message: 'Ready to retry authentication',
    });
  };

  const getStepIcon = () => {
    switch (authState.step) {
      case 'idle':
        return <Chrome className="w-8 h-8 text-blue-600" />;
      case 'authenticating':
        return <Chrome className="w-8 h-8 text-blue-600 animate-pulse" />;
      case 'creating-wallet':
        return <Wallet className="w-8 h-8 text-purple-600 animate-pulse" />;
      case 'verifying':
        return <Shield className="w-8 h-8 text-green-600 animate-pulse" />;
      case 'complete':
        return <CheckCircle className="w-8 h-8 text-green-600" />;
      case 'error':
        return <AlertTriangle className="w-8 h-8 text-red-600" />;
      default:
        return <Chrome className="w-8 h-8 text-gray-400" />;
    }
  };

  const getStepDescription = () => {
    switch (authState.step) {
      case 'idle':
        return 'Click the button below to start the secure authentication process with Google.';
      case 'authenticating':
        return 'Please complete the authentication in the popup window. Do not close this window.';
      case 'creating-wallet':
        return 'We\'re creating your secure smart wallet on the Base network.';
      case 'verifying':
        return 'Verifying your account and setting up security features.';
      case 'complete':
        return 'Your account is ready! You\'ll be redirected to complete your profile.';
      case 'error':
        return authState.error || 'An error occurred during authentication.';
      default:
        return '';
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto border-0 shadow-xl max-h-[80vh] overflow-y-auto">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
          {getStepIcon()}
        </div>
        <CardTitle className="text-xl">
          {authState.step === 'idle' && 'Secure Authentication'}
          {authState.step === 'authenticating' && 'Authenticating...'}
          {authState.step === 'creating-wallet' && 'Creating Wallet...'}
          {authState.step === 'verifying' && 'Verifying Account...'}
          {authState.step === 'complete' && 'Success!'}
          {authState.step === 'error' && 'Authentication Failed'}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Progress Bar */}
        {authState.step !== 'idle' && authState.step !== 'error' && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Progress</span>
              <span>{authState.progress}%</span>
            </div>
            <Progress value={authState.progress} className="h-2" />
          </div>
        )}

        {/* Status Message */}
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {getStepDescription()}
          </p>
          <p className="text-xs text-gray-500">
            {authState.message}
          </p>
        </div>

        {/* Error Display */}
        {authState.step === 'error' && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {authState.error}
              {retryCount < maxRetries && (
                <div className="mt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleRetry}
                    className="mr-2"
                  >
                    Retry ({maxRetries - retryCount} attempts left)
                  </Button>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {authState.step === 'idle' && (
            <Button
              onClick={startAuthentication}
              className="w-full bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              <Chrome className="w-4 h-4 mr-2" />
              Continue with Google
            </Button>
          )}

          {authState.step === 'authenticating' && (
            <Button
              onClick={() => handleAuthError('Authentication cancelled by user')}
              variant="outline"
              className="w-full"
            >
              Cancel Authentication
            </Button>
          )}

          {(authState.step === 'error' && retryCount >= maxRetries) && (
            <Button
              onClick={onCancel}
              variant="outline"
              className="w-full"
            >
              Close
            </Button>
          )}
        </div>

        {/* Security Information */}
        {authState.step === 'idle' && (
          <>
            <Separator />
            <div className="space-y-4">
              <h4 className="font-medium text-sm">What happens next:</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-3">
                  <User className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Google Authentication</p>
                    <p className="text-gray-600 dark:text-gray-400 text-xs">
                      Secure login with your Google account
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Key className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Wallet Creation</p>
                    <p className="text-gray-600 dark:text-gray-400 text-xs">
                      Generate your secure smart wallet
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Database className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Account Verification</p>
                    <p className="text-gray-600 dark:text-gray-400 text-xs">
                      Verify and secure your account
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <div className="flex items-start space-x-2">
                <Lock className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-blue-800 dark:text-blue-200">
                  <p className="font-medium mb-1">Secure & Private</p>
                  <p>
                    Your private keys are encrypted and never stored on our servers. 
                    Only you have access to your wallet.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Loading States */}
        {(authState.step === 'creating-wallet' || authState.step === 'verifying') && (
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Please wait...
              </span>
            </div>
            
            <div className="text-xs text-center text-gray-500">
              This process is secure and typically takes 30-60 seconds
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}