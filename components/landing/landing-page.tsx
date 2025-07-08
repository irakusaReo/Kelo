'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { WalletConnection } from '@/components/wallet/wallet-connection';
import { GoogleAuthButton } from '@/components/auth/google-auth-button';
import { Separator } from '@/components/ui/separator';
import { 
  Coins, 
  CreditCard, 
  Shield, 
  TrendingUp, 
  Smartphone, 
  Globe,
  CheckCircle,
  ArrowRight,
  Zap,
  DollarSign,
  Users,
  Lock,
  X,
  Star,
  Clock,
  Target,
  Wallet
} from 'lucide-react';

export function LandingPage() {
  const [showGetStartedModal, setShowGetStartedModal] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);

  const features = [
    {
      icon: CreditCard,
      title: 'Buy Now, Pay Later',
      description: 'Shop instantly and pay in flexible installments with competitive rates.',
    },
    {
      icon: Coins,
      title: 'Multi-Currency Support',
      description: 'Borrow in KES, USD, or ETH with automatic conversion capabilities.',
    },
    {
      icon: TrendingUp,
      title: 'Yield Generation',
      description: 'Earn passive income on idle funds through our secure vault system.',
    },
    {
      icon: Smartphone,
      title: 'M-Pesa Integration',
      description: 'Seamless payments through M-Pesa for maximum convenience.',
    },
    {
      icon: Shield,
      title: 'Web3 Security',
      description: 'Built on Base L2 with smart contract security and transparency.',
    },
    {
      icon: Globe,
      title: 'Global Access',
      description: 'Access your account anywhere with decentralized infrastructure.',
    },
  ];

  const stats = [
    { label: 'Total Loans Issued', value: 'KES 2.5B+', icon: DollarSign },
    { label: 'Active Users', value: '50K+', icon: Users },
    { label: 'Average APR', value: '15%', icon: TrendingUp },
    { label: 'Security Score', value: '99.9%', icon: Lock },
  ];

  const benefits = [
    {
      icon: Zap,
      title: 'Instant Approval',
      description: 'Get approved in under 2 seconds with our AI-powered credit assessment',
      highlight: '2 seconds',
    },
    {
      icon: Shield,
      title: 'Bank-Level Security',
      description: 'Your funds and data are protected by military-grade encryption',
      highlight: '256-bit encryption',
    },
    {
      icon: Target,
      title: 'Flexible Terms',
      description: 'Choose payment plans from 4 weeks to 24 months that fit your budget',
      highlight: 'Up to 24 months',
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Get help anytime with our round-the-clock customer support team',
      highlight: 'Always available',
    },
  ];

  const handleGoogleAuthSuccess = () => {
    setShowGetStartedModal(false);
    // Redirect will be handled by the auth provider
  };

  const handleGoogleAuthError = (error: string) => {
    console.error('Google auth error:', error);
    // Error handling is managed within the GoogleAuthButton component
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-green-950 dark:via-gray-900 dark:to-emerald-950">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md dark:bg-gray-900/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">K</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">Kelo</span>
          </div>
          <Button 
            onClick={() => setShowGetStartedModal(true)} 
            className="bg-green-600 hover:bg-green-700"
          >
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-4 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <Zap className="w-3 h-3 mr-1" />
            Powered by Web3
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Buy Now, Pay Later
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Kenya's first Web3 BNPL platform. Shop instantly, pay flexibly, and earn yield on your funds. 
            Built with cutting-edge blockchain technology and M-Pesa integration.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-green-600 hover:bg-green-700 text-lg px-8 py-6"
              onClick={() => setShowGetStartedModal(true)}
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white/50 dark:bg-gray-900/50">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full mb-4">
                  <stat.icon className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Kelo?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Experience the future of financial services with our innovative Web3 BNPL platform.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Get started with Kelo in just a few simple steps
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: '1',
                title: 'Connect Your Wallet',
                description: 'Link your Coinbase Wallet or any Web3 wallet to get started instantly.',
              },
              {
                step: '2',
                title: 'Complete KYC',
                description: 'Quick verification process to unlock your credit limit and start borrowing.',
              },
              {
                step: '3',
                title: 'Start Shopping',
                description: 'Shop now and pay later with flexible terms tailored to your needs.',
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold">{item.step}</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">{item.title}</h3>
                <p className="opacity-90">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Ready to Transform Your Financial Future?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of Kenyans who are already using Kelo to shop smarter and earn more.
          </p>
          <Button 
            size="lg" 
            className="bg-green-600 hover:bg-green-700 text-lg px-8 py-6"
            onClick={() => setShowGetStartedModal(true)}
          >
            Get Started Now
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50 dark:bg-gray-900 py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">K</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">Kelo</span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
              <span>© 2024 Kelo. All rights reserved.</span>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>CBK Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Get Started Modal */}
      <Dialog open={showGetStartedModal} onOpenChange={setShowGetStartedModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-bold">Get Started with Kelo</DialogTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowGetStartedModal(false)}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>
          
          <ScrollArea className="max-h-[calc(80vh-80px)] overflow-y-auto">
            <div className="p-6 pt-4 space-y-8">
              {/* Quick Start Section */}
              <div className="text-center">
                <Badge className="mb-4 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  <Star className="w-3 h-3 mr-1" />
                  Recommended
                </Badge>
                <h3 className="text-xl font-semibold mb-2">Start in 30 seconds</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Sign up with Google and get instant access to your Kelo account with automatic wallet creation.
                </p>
                
                <div className="max-w-md mx-auto">
                  <GoogleAuthButton 
                    onSuccess={handleGoogleAuthSuccess}
                    size="lg"
                    className="w-full mb-4"
                  />
                  <p className="text-xs text-gray-500">
                    ✓ No crypto experience needed • ✓ Instant setup • ✓ Secure smart wallet
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-gray-900 px-2 text-gray-500">
                    Or connect existing wallet
                  </span>
                </div>
              </div>

              {/* Wallet Connection Option */}
              <div className="text-center">
                <h4 className="font-semibold mb-4">Connect Your Existing Wallet</h4>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowGetStartedModal(false);
                    setShowWalletModal(true);
                  }}
                  className="w-full max-w-md mx-auto"
                  size="lg"
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  Connect Wallet
                </Button>
              </div>

              <Separator />

              {/* Benefits Grid */}
              <div>
                <h4 className="font-semibold text-center mb-6">Why Choose Kelo?</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg flex-shrink-0">
                        <benefit.icon className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h5 className="font-semibold mb-1">{benefit.title}</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {benefit.description}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {benefit.highlight}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security Notice */}
              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800 dark:text-blue-200">
                    <p className="font-medium mb-1">Your Security is Our Priority</p>
                    <p>
                      We use bank-level encryption and never store your private keys. Your wallet remains 
                      fully under your control at all times.
                    </p>
                  </div>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-4">Trusted by 50,000+ users across Kenya</p>
                <div className="flex justify-center items-center space-x-6 text-xs text-gray-400">
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    <span>CBK Compliant</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Shield className="w-3 h-3 text-blue-600" />
                    <span>ISO 27001</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Lock className="w-3 h-3 text-purple-600" />
                    <span>SOC 2 Type II</span>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Wallet Connection Modal */}
      {showWalletModal && (
        <WalletConnection onClose={() => setShowWalletModal(false)} />
      )}
    </div>
  );
}