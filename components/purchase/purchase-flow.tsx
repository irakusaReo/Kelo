'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { 
  ShoppingCart, 
  CreditCard, 
  Calendar, 
  CheckCircle, 
  ArrowRight,
  Zap,
  Shield,
  Clock,
  DollarSign,
  Smartphone,
  Wallet,
  LockIcon
} from 'lucide-react';

interface PurchaseItem {
  id: string;
  name: string;
  price: number;
  image: string;
  merchant: string;
}

interface PurchaseFlowProps {
  item: PurchaseItem;
  onComplete: () => void;
}

export function PurchaseFlow({ item, onComplete }: PurchaseFlowProps) {
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState('4-weeks');
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [isProcessing, setIsProcessing] = useState(false);

  const paymentPlans = [
    {
      id: '4-weeks',
      name: 'Pay in 4',
      description: '4 interest-free payments',
      installments: 4,
      frequency: 'bi-weekly',
      fee: 0,
      popular: true,
    },
    {
      id: '6-months',
      name: '6 months',
      description: 'Monthly payments',
      installments: 6,
      frequency: 'monthly',
      fee: item.price * 0.15,
      popular: false,
    },
    {
      id: '12-months',
      name: '12 months',
      description: 'Extended payments',
      installments: 12,
      frequency: 'monthly',
      fee: item.price * 0.25,
      popular: false,
    },
  ];

  const selectedPlanData = paymentPlans.find(p => p.id === selectedPlan);
  const installmentAmount = selectedPlanData ? 
    (item.price + selectedPlanData.fee) / selectedPlanData.installments : 0;

  const handleApproval = async () => {
    setIsProcessing(true);
    // Simulate instant approval
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setStep(3);
  };

  const handlePurchase = async () => {
    setIsProcessing(true);
    // Simulate purchase processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsProcessing(false);
    onComplete();
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        {[1, 2, 3].map((stepNum) => (
          <div key={stepNum} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= stepNum 
                ? 'bg-pink-500 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
            }`}>
              {step > stepNum ? <CheckCircle className="w-4 h-4" /> : stepNum}
            </div>
            {stepNum < 3 && (
              <div className={`w-12 h-1 mx-2 ${
                step > stepNum ? 'bg-pink-500' : 'bg-gray-200 dark:bg-gray-700'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Choose Payment Plan */}
      {step === 1 && (
        <div className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ShoppingCart className="w-5 h-5 text-pink-500" />
                <span>Choose your payment plan</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Item Summary */}
              <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg mb-6">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{item.merchant}</p>
                  <p className="text-lg font-bold text-pink-600">KES {item.price.toLocaleString()}</p>
                </div>
              </div>

              {/* Payment Plans */}
              <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan}>
                <div className="space-y-3">
                  {paymentPlans.map((plan) => (
                    <div key={plan.id} className="relative">
                      <Label
                        htmlFor={plan.id}
                        className={`flex items-center space-x-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          selectedPlan === plan.id
                            ? 'border-pink-500 bg-pink-50 dark:bg-pink-950'
                            : 'border-gray-200 dark:border-gray-700 hover:border-pink-200'
                        }`}
                      >
                        <RadioGroupItem value={plan.id} id={plan.id} />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold">{plan.name}</span>
                            {plan.popular && (
                              <Badge className="bg-pink-500 text-white">Most Popular</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{plan.description}</p>
                          <div className="mt-2 flex items-center space-x-4 text-sm">
                            <span className="font-medium">
                              KES {Math.round((item.price + plan.fee) / plan.installments).toLocaleString()} 
                              × {plan.installments}
                            </span>
                            {plan.fee > 0 && (
                              <span className="text-gray-500">
                                +KES {plan.fee.toLocaleString()} total interest
                              </span>
                            )}
                          </div>
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>

              <Button 
                onClick={() => setStep(2)}
                className="w-full mt-6 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                size="lg"
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 2: Instant Approval */}
      {step === 2 && (
        <div className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center space-x-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                <span>Instant Approval</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {!isProcessing ? (
                <>
                  {/* Purchase Summary */}
                  <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950 dark:to-purple-950 p-6 rounded-lg">
                    <h3 className="font-semibold mb-4">Purchase Summary</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Item total</span>
                        <span>KES {item.price.toLocaleString()}</span>
                      </div>
                      {selectedPlanData && selectedPlanData.fee > 0 && (
                        <div className="flex justify-between">
                          <span>Interest</span>
                          <span>KES {selectedPlanData.fee.toLocaleString()}</span>
                        </div>
                      )}
                      <Separator />
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>KES {(item.price + (selectedPlanData?.fee || 0)).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Schedule */}
                  <div className="space-y-3">
                    <h4 className="font-semibold">Payment Schedule</h4>
                    {selectedPlanData && Array.from({ length: selectedPlanData.installments }).map((_, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                            index === 0 ? 'bg-pink-500 text-white' : 'bg-gray-200 dark:bg-gray-700'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">Payment {index + 1}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {index === 0 ? 'Today' : `In ${index * (selectedPlanData.frequency === 'bi-weekly' ? 2 : 4)} weeks`}
                            </p>
                          </div>
                        </div>
                        <span className="font-semibold">KES {Math.round(installmentAmount).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center space-x-2 p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-green-800 dark:text-green-200">
                      You're pre-approved! No impact on your credit score.
                    </span>
                  </div>

                  <Button 
                    onClick={handleApproval}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                    size="lg"
                  >
                    Get Instant Approval
                    <Zap className="w-4 h-4 ml-2" />
                  </Button>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Processing your approval...</h3>
                  <p className="text-gray-600 dark:text-gray-400">This usually takes just a few seconds</p>
                  <Progress value={66} className="mt-4 max-w-xs mx-auto" />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 3: Complete Purchase */}
      {step === 3 && (
        <div className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle>Approved!</CardTitle>
              <p className="text-gray-600 dark:text-gray-400">
                Complete your purchase to get your item
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Payment Method Selection */}
              <div>
                <h4 className="font-semibold mb-3">Choose payment method for first installment</h4>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="space-y-3">
                    <Label
                      htmlFor="mpesa"
                      className={`flex items-center space-x-4 p-4 border-2 rounded-lg cursor-pointer ${
                        paymentMethod === 'mpesa'
                          ? 'border-pink-500 bg-pink-50 dark:bg-pink-950'
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <RadioGroupItem value="mpesa" id="mpesa" />
                      <Smartphone className="w-6 h-6 text-green-600" />
                      <div>
                        <span className="font-semibold">M-Pesa</span>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Pay with your mobile money</p>
                      </div>
                    </Label>

                    <Label
                      htmlFor="crypto"
                      className={`flex items-center space-x-4 p-4 border-2 rounded-lg cursor-pointer ${
                        paymentMethod === 'crypto'
                          ? 'border-pink-500 bg-pink-50 dark:bg-pink-950'
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <RadioGroupItem value="crypto" id="crypto" />
                      <Wallet className="w-6 h-6 text-purple-600" />
                      <div>
                        <span className="font-semibold">Cryptocurrency</span>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Pay from your connected wallet</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* First Payment Amount */}
              <div className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950 dark:to-purple-950 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">First payment today:</span>
                  <span className="text-xl font-bold text-pink-600">
                    KES {Math.round(installmentAmount).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Remaining payments will be automatically charged
                </p>
              </div>

              <Button 
                onClick={handlePurchase}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    Complete Purchase
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>

              <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <Shield className="w-3 h-3" />
                  <span>Secure</span>
                </div>
                <div className="flex items-center space-x-1">
                  <LockIcon className="w-3 h-3" />
                  <span>Encrypted</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>Instant</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}