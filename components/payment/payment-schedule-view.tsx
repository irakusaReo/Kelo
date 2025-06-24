'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Calendar, 
  CheckCircle, 
  Clock, 
  CreditCard, 
  Smartphone,
  AlertTriangle,
  ArrowRight,
  DollarSign
} from 'lucide-react';
import { format, addWeeks, addMonths } from 'date-fns';

interface Payment {
  id: string;
  amount: number;
  dueDate: Date;
  status: 'paid' | 'upcoming' | 'overdue';
  paymentNumber: number;
  totalPayments: number;
}

interface PaymentScheduleViewProps {
  payments: Payment[];
  totalAmount: number;
  productName: string;
  onPayNow: (paymentId: string) => void;
}

export function PaymentScheduleView({ payments, totalAmount, productName, onPayNow }: PaymentScheduleViewProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('mpesa');

  const paidAmount = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
  const remainingAmount = totalAmount - paidAmount;
  const progressPercentage = (paidAmount / totalAmount) * 100;

  const nextPayment = payments.find(p => p.status === 'upcoming' || p.status === 'overdue');
  const overduePayments = payments.filter(p => p.status === 'overdue');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'overdue':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const handlePayNow = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowPaymentModal(true);
  };

  const processPayment = async () => {
    if (!selectedPayment) return;
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    onPayNow(selectedPayment.id);
    setShowPaymentModal(false);
    setSelectedPayment(null);
  };

  return (
    <div className="space-y-6">
      {/* Payment Overview */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950 dark:to-purple-950">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5 text-pink-600" />
            <span>{productName}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Paid so far</p>
              <p className="text-2xl font-bold text-green-600">KES {paidAmount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Remaining</p>
              <p className="text-2xl font-bold text-pink-600">KES {remainingAmount.toLocaleString()}</p>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Progress</span>
              <span>{Math.round(progressPercentage)}% complete</span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
          </div>

          {nextPayment && (
            <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
              <div>
                <p className="font-semibold">Next payment</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Due {format(nextPayment.dueDate, 'MMM dd, yyyy')}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">KES {nextPayment.amount.toLocaleString()}</p>
                <Button 
                  size="sm" 
                  onClick={() => handlePayNow(nextPayment)}
                  className="bg-pink-500 hover:bg-pink-600"
                >
                  Pay Now
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Overdue Alert */}
      {overduePayments.length > 0 && (
        <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span className="font-semibold text-red-800 dark:text-red-200">
                {overduePayments.length} overdue payment{overduePayments.length > 1 ? 's' : ''}
              </span>
            </div>
            <p className="text-sm text-red-700 dark:text-red-300 mb-3">
              Total overdue: KES {overduePayments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
            </p>
            <Button 
              size="sm" 
              variant="outline" 
              className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-300"
              onClick={() => overduePayments[0] && handlePayNow(overduePayments[0])}
            >
              Pay Overdue Amount
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Payment Schedule */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Payment Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {payments.map((payment, index) => (
              <div 
                key={payment.id}
                className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                  payment.status === 'paid' 
                    ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800'
                    : payment.status === 'overdue'
                    ? 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800'
                    : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    payment.status === 'paid' 
                      ? 'bg-green-100 dark:bg-green-900'
                      : payment.status === 'overdue'
                      ? 'bg-red-100 dark:bg-red-900'
                      : 'bg-gray-100 dark:bg-gray-700'
                  }`}>
                    {getStatusIcon(payment.status)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">Payment {payment.paymentNumber}</span>
                      <Badge className={getStatusColor(payment.status)}>
                        {payment.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {format(payment.dueDate, 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-lg font-bold">KES {payment.amount.toLocaleString()}</p>
                  {payment.status !== 'paid' && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handlePayNow(payment)}
                      className="mt-1"
                    >
                      Pay Now
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Modal */}
      {showPaymentModal && selectedPayment && (
        <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Make Payment</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Payment Amount */}
              <div className="text-center p-6 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950 dark:to-purple-950 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Payment amount</p>
                <p className="text-3xl font-bold text-pink-600">
                  KES {selectedPayment.amount.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Due {format(selectedPayment.dueDate, 'MMM dd, yyyy')}
                </p>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium mb-3">Payment method</label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mpesa">
                      <div className="flex items-center space-x-2">
                        <Smartphone className="w-4 h-4 text-green-600" />
                        <span>M-Pesa</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="crypto">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-purple-600" />
                        <span>Cryptocurrency</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="card">
                      <div className="flex items-center space-x-2">
                        <CreditCard className="w-4 h-4 text-blue-600" />
                        <span>Debit/Credit Card</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Payment Info */}
              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-800 dark:text-blue-200">Payment Processing</span>
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Your payment will be processed instantly and your account will be updated immediately.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={processPayment}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                >
                  Pay Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}