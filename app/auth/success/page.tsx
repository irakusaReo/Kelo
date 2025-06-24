'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Loader2 } from 'lucide-react';

export default function AuthSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Get token from cookie and store in localStorage
    const getTokenFromCookie = () => {
      const cookies = document.cookie.split(';');
      const tokenCookie = cookies.find(cookie => 
        cookie.trim().startsWith('kelo_auth_token=')
      );
      return tokenCookie?.split('=')[1];
    };

    const token = getTokenFromCookie();
    if (token) {
      localStorage.setItem('kelo_auth_token', token);
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } else {
      // No token found, redirect to error page
      router.push('/auth/error?error=no_token');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-green-950 dark:via-gray-900 dark:to-emerald-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-0 shadow-xl">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-600">
            Welcome to Kelo!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Your account has been successfully created with a secure smart wallet.
          </p>
          
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Redirecting to your dashboard...</span>
          </div>

          <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg text-left">
            <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">
              What's next?
            </h4>
            <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
              <li>• Complete your profile setup</li>
              <li>• Verify your identity for higher limits</li>
              <li>• Start shopping with instant approval</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}