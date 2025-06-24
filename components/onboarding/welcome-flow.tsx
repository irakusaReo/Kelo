'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useConnect, useAccount } from 'wagmi';
import { 
  Wallet, 
  Shield, 
  Zap, 
  CheckCircle, 
  ArrowRight, 
  Smartphone,
  CreditCard,
  Clock,
  DollarSign,
  Lock,
  Globe
} from 'lucide-react';

interface WelcomeFlowProps {
  onComplete: () => void;
}

export function WelcomeFlow({ onComplete }: WelcomeFlowProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    acceptTerms: false,
    acceptPrivacy: false,
  });
  const { connect, connectors } = useConnect();
  const { isConnected } = useAccount();

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const handleWalletConnect = (connector: any) => {
    connect({ connector });
    setTimeout(() => setStep(3), 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>Step {step} of {totalSteps}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step 1: Welcome */}
        {step === 1 && (
          <Card className="border-0 shadow-xl">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-2xl">K</span>
              </div>
              <CardTitle className="text-2xl font-bold">Welcome to Kelo</CardTitle>
              <p className="text-gray-600 dark:text-gray-300">
                Shop now, pay later with Web3 technology
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-pink-50 dark:bg-pink-950 rounded-lg">
                  <Zap className="w-8 h-8 text-pink-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-sm">Instant Approval</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Get approved in seconds</p>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                  <Shield className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-sm">Secure & Safe</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Blockchain protected</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm">No hidden fees or surprises</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm">Flexible payment plans</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm">Build your credit score</span>
                </div>
              </div>

              <Button 
                onClick={handleNext} 
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
                size="lg"
              >
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Basic Info */}
        {step === 2 && (
          <Card className="border-0 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Let's get to know you</CardTitle>
              <p className="text-gray-600 dark:text-gray-300">
                Just a few details to get started
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Phone number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+254 712 345 678"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">For M-Pesa payments and notifications</p>
              </div>

              <div className="space-y-3 pt-4">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.acceptTerms}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, acceptTerms: checked as boolean }))
                    }
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-300">
                    I agree to the <span className="text-pink-600 underline">Terms of Service</span>
                  </label>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="privacy"
                    checked={formData.acceptPrivacy}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, acceptPrivacy: checked as boolean }))
                    }
                  />
                  <label htmlFor="privacy" className="text-sm text-gray-600 dark:text-gray-300">
                    I agree to the <span className="text-pink-600 underline">Privacy Policy</span>
                  </label>
                </div>
              </div>

              <Button 
                onClick={handleNext}
                disabled={!formData.email || !formData.phone || !formData.acceptTerms || !formData.acceptPrivacy}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                size="lg"
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Wallet Connection */}
        {step === 3 && (
          <Card className="border-0 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Connect your wallet</CardTitle>
              <p className="text-gray-600 dark:text-gray-300">
                Choose your preferred wallet to secure your account
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {connectors.map((connector) => (
                <Button
                  key={connector.id}
                  variant="outline"
                  className="w-full h-16 justify-start space-x-4 hover:bg-pink-50 dark:hover:bg-pink-950 border-2 hover:border-pink-200"
                  onClick={() => handleWalletConnect(connector)}
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">{connector.name}</div>
                    <div className="text-sm text-gray-500">Secure Web3 wallet</div>
                  </div>
                </Button>
              ))}

              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Lock className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800 dark:text-blue-200">
                    <p className="font-medium mb-1">Your wallet, your control</p>
                    <p>We never store your private keys. Your funds remain secure in your wallet.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <Card className="border-0 shadow-xl">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-xl">You're all set!</CardTitle>
              <p className="text-gray-600 dark:text-gray-300">
                Your Kelo account is ready to use
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950 dark:to-purple-950 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">What's next?</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                    <span>Start shopping with instant approval</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Choose flexible payment plans</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                    <span>Build your credit score</span>
                  </li>
                </ul>
              </div>

              <Button 
                onClick={onComplete}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                size="lg"
              >
                Start Shopping
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}