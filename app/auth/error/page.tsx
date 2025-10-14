'use client';

import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

const errorMessages: Record<string, string> = {
  access_denied: 'You cancelled the authentication process.',
  missing_code: 'Authentication code was not received.',
  authentication_failed: 'Authentication failed. Please try again.',
  wallet_creation_failed: 'Failed to create your smart wallet. Please try again.',
  no_token: 'Authentication token not found.',
  invalid_token: 'Invalid authentication token.',
};

function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error') || 'unknown';
  const errorMessage = errorMessages[error] || 'An unknown error occurred.';

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-red-950 dark:via-gray-900 dark:to-orange-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-0 shadow-xl">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-600">
            Authentication Failed
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-gray-600 dark:text-gray-300">
            {errorMessage}
          </p>
          
          <div className="bg-red-50 dark:bg-red-950 p-4 rounded-lg">
            <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">
              What you can do:
            </h4>
            <ul className="text-sm text-red-700 dark:text-red-300 space-y-1 text-left">
              <li>• Try signing in again</li>
              <li>• Check your internet connection</li>
              <li>• Clear your browser cache</li>
              <li>• Contact support if the problem persists</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Link href="/">
              <Button className="w-full bg-green-600 hover:bg-green-700">
                Try Again
              </Button>
            </Link>
            
            <Link href="/">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthError />
    </Suspense>
  );
}
