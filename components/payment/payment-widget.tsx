'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { 
  CreditCard, 
  Calendar, 
  CheckCircle, 
  Clock,
  Zap,
  ArrowRight,
  Smartphone,
  Wallet,
  DollarSign
} from 'lucide-react';

interface PaymentWidgetProps {
  amount: number;
  merchantName: string;
  productName: string;
  onPaymentComplete: (paymentData: any) => void;
}

export function PaymentWidget({ amount, merchantName, productName, onPaymentComplete }: PaymentWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('pay-in-4');
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const paymentPlans = [
    {
      id: 'pay-in-4',
      name: 'Pay in 4',
      description: 'Interest-free',
      installments: 4,
      installmentAmount: amount / 4,
      totalCost: amount,
      popular: true,
      icon: <Zap className="w-4 h-4" />,
    },
    {
      id: 'monthly-6',
      name: '6 months',
      description: 'Low monthly payments',
      installments: 6,
      installmentAmount: (amount * 1.15) / 6,
      totalCost: amount * 1.15,
      popular: false,
      icon: <Calendar className="w-4 h-4" />,
    },
    {
      id: 'monthly-12',
      name: '12 months',
      description: 'Extended payments',
      installments: 12,
      installmentAmount: (amount * 1.25) / 12,
      totalCost: amount * 1.25,
      popular: false,
      icon: <Clock className="w-4 h-4" />,
    },
  ];

  const selectedPlanData = paymentPlans.find(p => p.id === selectedPlan);

  const handleContinue = async () => {
    setIsProcessing(true);
    
    // Simulate approval process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    setStep(2);
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const paymentData = {
      planId: selectedPlan,
      amount: selectedPlanData?.installmentAmount,
      totalCost: selectedPlanData?.totalCost,
      installments: selectedPlanData?.installments,
    };
    
    onPaymentComplete(paymentData);
    setIsProcessing(false);
    setIsOpen(false);
    setStep(1);
  };

  return (
    <>
      {/* Kelo Pay Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-0 shadow-lg"
        size="lg"
      >
        <div className="flex items-center justify-center space-x-2">
          <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold">K</span>
          </div>
          <span>Pay with Kelo</span>
        </div>
      </Button>

      {/* Payment Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">K</span>
              </div>
              <span>Kelo Checkout</span>
            </DialogTitle>
          </DialogHeader>

          {step === 1 && (
            <div className="space-y-6">
              {/* Purchase Summary */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="font-semibold mb-2">{productName}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{merchantName}</p>
                <p className="text-lg font-bold">KES {amount.toLocaleString()}</p>
              </div>

              {/* Payment Plans */}
              <div>
                <h4 className="font-semibold mb-3">Choose your payment plan</h4>
                <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan}>
                  <div className="space-y-3">
                    {paymentPlans.map((plan) => (
                      <Label
                        key={plan.id}
                        htmlFor={plan.id}
                        className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          selectedPlan === plan.id
                            ? 'border-pink-500 bg-pink-50 dark:bg-pink-950'
                            : 'border-gray-200 dark:border-gray-700 hover:border-pink-200'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value={plan.id} id={plan.id} />
                          <div className="flex items-center space-x-2">
                            {plan.icon}
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="font-semibold">{plan.name}</span>
                                {plan.popular && (
                                  <Badge className="bg-pink-500 text-white text-xs">Popular</Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{plan.description}</p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">KES {Math.round(plan.installmentAmount).toLocaleString()}</p>
                          <p className="text-xs text-gray-500">× {plan.installments}</p>
                        </div>
                      </Label>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              {/* Selected Plan Details */}
              {selectedPlanData && (
                <div className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950 dark:to-purple-950 rounded-lg">
                  <h4 className="font-semibold mb-2">Payment breakdown</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Today</span>
                      <span className="font-semibold">KES {Math.round(selectedPlanData.installmentAmount).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Remaining {selectedPlanData.installments - 1} payments</span>
                      <span>KES {Math.round(selectedPlanData.installmentAmount).toLocaleString()} each</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>KES {Math.round(selectedPlanData.totalCost).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}

              <Button
                onClick={handleContinue}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Checking eligibility...
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              {/* Approval Success */}
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">You're approved!</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Complete your first payment to finish the purchase
                </p>
              </div>

              {/* First Payment */}
              <div className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950 dark:to-purple-950 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">First payment</span>
                  <span className="text-xl font-bold text-pink-600">
                    KES {selectedPlanData ? Math.round(selectedPlanData.installmentAmount).toLocaleString() : '0'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Remaining payments will be automatically charged every {selectedPlanData?.id === 'pay-in-4' ? '2 weeks' : 'month'}
                </p>
              </div>

              {/* Payment Methods */}
              <div>
                <h4 className="font-semibold mb-3">Payment method</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Smartphone className="w-5 h-5 text-green-600" />
                    <div className="flex-1">
                      <span className="font-medium">M-Pesa</span>
                      <p className="text-sm text-gray-600 dark:text-gray-400">+254 712 *** 678</p>
                    </div>
                    <Badge variant="outline">Default</Badge>
                  </div>
                </div>
              </div>

              <Button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Processing payment...
                  </>
                ) : (
                  <>
                    Pay KES {selectedPlanData ? Math.round(selectedPlanData.installmentAmount).toLocaleString() : '0'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-gray-500">
                By continuing, you agree to Kelo's Terms of Service and Privacy Policy
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}