'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useGoogleAuth } from '@/lib/hooks/use-google-auth';
import { 
  Chrome, 
  Shield, 
  Wallet, 
  CheckCircle, 
  AlertTriangle,
  Loader2,
  Lock,
  Zap,
  X
} from 'lucide-react';

interface GoogleAuthButtonProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  variant?: 'default' | 'outline';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

export function GoogleAuthButton({ 
  onSuccess, 
  onError,
  variant = 'default', 
  size = 'default',
  className = ''
}: GoogleAuthButtonProps) {
  const { signInWithGoogle, isLoading, error } = useGoogleAuth();
  const [showWalletCreation, setShowWalletCreation] = useState(false);
  const [walletCreationStep, setWalletCreationStep] = useState(1);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleSignIn = async () => {
    try {
      setAuthError(null);
      setShowWalletCreation(true);
      setWalletCreationStep(1);
      
      // Simulate wallet creation process
      setTimeout(() => setWalletCreationStep(2), 1000);
      setTimeout(() => setWalletCreationStep(3), 2500);
      setTimeout(() => setWalletCreationStep(4), 4000);
      
      setTimeout(async () => {
        try {
          await signInWithGoogle();
          setShowWalletCreation(false);
          // Don't call onSuccess here as it will be handled by the auth provider
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
          setAuthError(errorMessage);
          setShowWalletCreation(false);
          onError?.(errorMessage);
        }
      }, 5500);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start authentication';
      setAuthError(errorMessage);
      setShowWalletCreation(false);
      onError?.(errorMessage);
    }
  };

  const handleRetry = () => {
    setAuthError(null);
    handleSignIn();
  };

  const handleDismissError = () => {
    setAuthError(null);
  };

  return (
    <>
      <div className="space-y-3">
        <Button
          onClick={handleSignIn}
          disabled={isLoading}
          variant={variant}
          size={size}
          className={`${className} ${variant === 'default' ? 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-300' : ''}`}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Chrome className="w-4 h-4 mr-2" />
          )}
          Continue with Google
        </Button>

        {/* Error Display */}
        {(error || authError) && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>{error || authError}</span>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRetry}
                  className="h-6 text-xs"
                >
                  Retry
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleDismissError}
                  className="h-6 w-6 p-0"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Wallet Creation Modal */}
      <Dialog open={showWalletCreation} onOpenChange={() => {}}>
        <DialogContent className="max-w-md" hideCloseButton>
          <DialogHeader>
            <DialogTitle className="text-center">Setting up your account</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Step {walletCreationStep} of 4</span>
                <span>{Math.round((walletCreationStep / 4) * 100)}%</span>
              </div>
              <Progress value={(walletCreationStep / 4) * 100} className="h-2" />
            </div>

            {/* Step Content */}
            <div className="text-center space-y-4">
              {walletCreationStep === 1 && (
                <>
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto">
                    <Chrome className="w-8 h-8 text-blue-600 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Authenticating with Google</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Securely verifying your Google account...
                    </p>
                  </div>
                </>
              )}

              {walletCreationStep === 2 && (
                <>
                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto">
                    <Wallet className="w-8 h-8 text-purple-600 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Creating your Smart Wallet</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Generating secure wallet keys on Base network...
                    </p>
                  </div>
                </>
              )}

              {walletCreationStep === 3 && (
                <>
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
                    <Shield className="w-8 h-8 text-green-600 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Securing your account</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Setting up recovery options and security features...
                    </p>
                  </div>
                </>
              )}

              {walletCreationStep === 4 && (
                <>
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Account ready!</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Your Kelo account is now set up and ready to use.
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Security Features */}
            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
              <h4 className="font-medium mb-3 flex items-center space-x-2">
                <Lock className="w-4 h-4 text-blue-600" />
                <span>Security Features</span>
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${walletCreationStep >= 1 ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <span className={walletCreationStep >= 1 ? 'text-green-700 dark:text-green-300' : 'text-gray-600 dark:text-gray-400'}>
                    Google account verification
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${walletCreationStep >= 2 ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <span className={walletCreationStep >= 2 ? 'text-green-700 dark:text-green-300' : 'text-gray-600 dark:text-gray-400'}>
                    Encrypted wallet generation
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${walletCreationStep >= 3 ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <span className={walletCreationStep >= 3 ? 'text-green-700 dark:text-green-300' : 'text-gray-600 dark:text-gray-400'}>
                    Recovery options setup
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${walletCreationStep >= 4 ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <span className={walletCreationStep >= 4 ? 'text-green-700 dark:text-green-300' : 'text-gray-600 dark:text-gray-400'}>
                    Account activation
                  </span>
                </div>
              </div>
            </div>

            {/* Privacy Notice */}
            <div className="text-xs text-gray-500 text-center">
              <p>
                Your wallet keys are encrypted and stored securely. Kelo never has access to your private keys.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}