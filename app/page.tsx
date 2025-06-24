'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { LandingPage } from '@/components/landing/landing-page';
import { Dashboard } from '@/components/dashboard/dashboard';
import { WalletConnection } from '@/components/wallet/wallet-connection';
import { LoadingScreen } from '@/components/ui/loading-screen';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { 
  ArrowRight, 
  Play, 
  Code, 
  Users,
  Zap
} from 'lucide-react';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <LoadingScreen />;
  }

  return <HomeContent />;
}

function HomeContent() {
  const { isConnected, isConnecting } = useAccount();

  if (isConnecting) {
    return <LoadingScreen message="Connecting to wallet..." />;
  }

  if (!isConnected) {
    return (
      <div>
        <LandingPage />
        
        {/* Demo Section */}
        <section className="py-20 px-4 bg-white dark:bg-gray-900">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Experience Kelo
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Try our platform and see how easy it is to shop now and pay later
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Play className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle>Try the Demo</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Experience the complete purchase and payment flow
                  </p>
                  <Link href="/demo">
                    <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                      Try Demo
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Code className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle>For Merchants</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Integrate Kelo into your store and boost sales
                  </p>
                  <Link href="/merchant">
                    <Button variant="outline" className="w-full">
                      View Integration
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle>Quick Start</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Get started with Kelo in just a few steps
                  </p>
                  <Link href="/onboarding">
                    <Button variant="outline" className="w-full">
                      Get Started
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return <Dashboard />;
}