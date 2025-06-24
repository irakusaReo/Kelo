'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { OnboardingFlow } from '@/components/onboarding/onboarding-flow';
import { useOnboarding } from '@/lib/hooks/use-onboarding';
import { useAuth } from '@/components/auth/auth-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, Zap } from 'lucide-react';
import { toast } from 'sonner';

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { submitOnboarding, isSubmitting, error } = useOnboarding();
  const [isComplete, setIsComplete] = useState(false);
  const [completionData, setCompletionData] = useState<any>(null);

  const handleOnboardingComplete = async (userData: any) => {
    try {
      const result = await submitOnboarding(userData);
      
      if (result.success) {
        setCompletionData({
          creditLimit: result.creditLimit,
          profileCompleteness: userData.profileCompleteness,
        });
        setIsComplete(true);
        
        toast.success('Profile completed successfully!', {
          description: `Your credit limit is KES ${result.creditLimit?.toLocaleString()}`,
        });
      } else {
        toast.error('Failed to complete onboarding', {
          description: result.error,
        });
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    }
  };

  const handleGoToMarketplace = () => {
    router.push('/marketplace');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Authentication Required</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Please sign in to complete your profile setup.
            </p>
            <Button onClick={() => router.push('/')}>
              Go to Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isComplete && completionData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <Card className="max-w-2xl border-0 shadow-2xl">
          <CardHeader className="text-center pb-4">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <CardTitle className="text-3xl font-bold mb-2">
              Welcome to Kelo! 🎉
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Your account is ready and you can start shopping immediately
            </p>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Credit Limit Showcase */}
            <div className="text-center p-8 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 rounded-xl">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Zap className="w-6 h-6 text-yellow-500" />
                <h3 className="text-xl font-semibold">Your Credit Limit</h3>
              </div>
              <div className="text-4xl font-bold text-green-600 mb-2">
                KES {completionData.creditLimit?.toLocaleString()}
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Available for immediate use
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {completionData.profileCompleteness}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Profile Complete
                </div>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  2 sec
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Approval Time
                </div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  0%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Setup Fees
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">What's next?</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Browse thousands of products</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Get instant approval on purchases</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Choose flexible payment plans</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Build your credit score</span>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <Button 
              onClick={handleGoToMarketplace}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
              size="lg"
            >
              Start Shopping Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>

            {/* Security Notice */}
            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              <p>
                Your information is secure and encrypted. We comply with all data protection regulations.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <OnboardingFlow onComplete={handleOnboardingComplete} />;
}