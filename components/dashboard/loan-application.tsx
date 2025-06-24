'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useUser } from '@/lib/hooks/use-user';
import { CURRENCIES, LOAN_TERMS } from '@/lib/constants';
import { Calculator, CreditCard, Smartphone, DollarSign, Calendar, Percent } from 'lucide-react';

const loanSchema = z.object({
  amount: z.number().min(1000, 'Minimum loan amount is KES 1,000').max(1000000, 'Maximum loan amount is KES 1,000,000'),
  currency: z.enum(['KES', 'USD', 'ETH']),
  termMonths: z.number().min(3).max(24),
  purpose: z.string().min(10, 'Please provide a detailed purpose'),
});

type LoanFormData = z.infer<typeof loanSchema>;

interface LoanApplicationProps {
  onClose?: () => void;
}

export function LoanApplication({ onClose }: LoanApplicationProps) {
  const { user } = useUser();
  const [step, setStep] = useState(1);
  const [selectedTerm, setSelectedTerm] = useState<typeof LOAN_TERMS[0] | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LoanFormData>({
    resolver: zodResolver(loanSchema),
    defaultValues: {
      currency: 'KES',
      termMonths: 6,
      purpose: '',
    },
  });

  const watchedAmount = form.watch('amount');
  const watchedCurrency = form.watch('currency');
  const watchedTermMonths = form.watch('termMonths');

  const calculateLoanDetails = () => {
    if (!watchedAmount || !selectedTerm) return null;

    const principal = watchedAmount;
    const monthlyRate = selectedTerm.apr / 100 / 12;
    const numPayments = selectedTerm.months;
    
    const monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                          (Math.pow(1 + monthlyRate, numPayments) - 1);
    
    const totalPayment = monthlyPayment * numPayments;
    const totalInterest = totalPayment - principal;

    return {
      monthlyPayment: Math.round(monthlyPayment),
      totalPayment: Math.round(totalPayment),
      totalInterest: Math.round(totalInterest),
    };
  };

  const loanDetails = calculateLoanDetails();
  const maxLoanAmount = user ? user.creditScore * 100 : 50000;

  const onSubmit = async (data: LoanFormData) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In production, this would make an actual API call
    console.log('Loan application submitted:', data);
    
    setIsSubmitting(false);
    setStep(4); // Success step
  };

  const handleTermSelection = (term: typeof LOAN_TERMS[0]) => {
    setSelectedTerm(term);
    form.setValue('termMonths', term.months);
  };

  if (!onClose) {
    // Standalone component
    return (
      <div className="space-y-6">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5 text-green-600" />
              <span>Apply for New Loan</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LoanApplicationForm />
          </CardContent>
        </Card>
      </div>
    );
  }

  function LoanApplicationForm() {
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Loan Amount & Currency</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Choose your loan amount and preferred currency
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loan Amount</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter amount"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Maximum: {CURRENCIES[watchedCurrency].symbol} {maxLoanAmount.toLocaleString()}
                      </p>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(CURRENCIES).map(([key, currency]) => (
                            <SelectItem key={key} value={key}>
                              <div className="flex items-center space-x-2">
                                <span>{currency.icon}</span>
                                <span>{currency.name} ({currency.symbol})</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button 
                type="button" 
                onClick={() => setStep(2)} 
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={!watchedAmount || watchedAmount < 1000}
              >
                Continue
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Choose Loan Term</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Select your preferred repayment period
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {LOAN_TERMS.map((term) => (
                  <Card 
                    key={term.months}
                    className={`cursor-pointer transition-all ${
                      selectedTerm?.months === term.months 
                        ? 'ring-2 ring-green-600 bg-green-50 dark:bg-green-950' 
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => handleTermSelection(term)}
                  >
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="text-xl font-bold text-gray-900 dark:text-white">
                          {term.label}
                        </div>
                        <div className="text-green-600 font-semibold">
                          {term.apr}% APR
                        </div>
                        {selectedTerm?.months === term.months && loanDetails && (
                          <div className="mt-3 space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span>Monthly Payment:</span>
                              <span className="font-semibold">
                                {CURRENCIES[watchedCurrency].symbol} {loanDetails.monthlyPayment.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Total Interest:</span>
                              <span className="font-semibold">
                                {CURRENCIES[watchedCurrency].symbol} {loanDetails.totalInterest.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex space-x-3">
                <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Back
                </Button>
                <Button 
                  type="button" 
                  onClick={() => setStep(3)} 
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={!selectedTerm}
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Loan Purpose</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Tell us what you'll use this loan for
                </p>
              </div>

              <FormField
                control={form.control}
                name="purpose"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purpose of Loan</FormLabel>
                    <FormControl>
                      <textarea
                        {...field}
                        className="w-full p-3 border rounded-md resize-none"
                        rows={4}
                        placeholder="Please describe how you plan to use this loan..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Loan Summary */}
              <Card className="bg-gray-50 dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-lg">Loan Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Loan Amount:</span>
                    <span className="font-semibold">
                      {CURRENCIES[watchedCurrency].symbol} {watchedAmount?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Term:</span>
                    <span className="font-semibold">{selectedTerm?.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>APR:</span>
                    <span className="font-semibold">{selectedTerm?.apr}%</span>
                  </div>
                  <Separator />
                  {loanDetails && (
                    <>
                      <div className="flex justify-between">
                        <span>Monthly Payment:</span>
                        <span className="font-semibold text-green-600">
                          {CURRENCIES[watchedCurrency].symbol} {loanDetails.monthlyPayment.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Payment:</span>
                        <span className="font-semibold">
                          {CURRENCIES[watchedCurrency].symbol} {loanDetails.totalPayment.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Interest:</span>
                        <span className="font-semibold">
                          {CURRENCIES[watchedCurrency].symbol} {loanDetails.totalInterest.toLocaleString()}
                        </span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <div className="flex space-x-3">
                <Button type="button" variant="outline" onClick={() => setStep(2)} className="flex-1">
                  Back
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
                <CreditCard className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Application Submitted!</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Your loan application has been submitted successfully. You'll receive a decision within 24 hours.
                </p>
              </div>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Application ID: #LA-{Date.now().toString().slice(-6)}
              </Badge>
              <Button 
                onClick={onClose} 
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Close
              </Button>
            </div>
          )}
        </form>
      </Form>
    );
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Apply for Loan</DialogTitle>
        </DialogHeader>
        <LoanApplicationForm />
      </DialogContent>
    </Dialog>
  );
}