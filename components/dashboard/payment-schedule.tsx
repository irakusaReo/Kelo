'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLoans } from '@/lib/hooks/use-loans';
import { format, addMonths, isToday, isBefore, isAfter } from 'date-fns';
import { 
  Calendar as CalendarIcon, 
  CreditCard, 
  Smartphone, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  DollarSign
} from 'lucide-react';

export function PaymentSchedule() {
  const { loans } = useLoans();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('');

  // Generate payment schedule for all loans
  const generatePaymentSchedule = () => {
    const schedule: any[] = [];
    
    loans.forEach(loan => {
      const monthlyPayment = loan.nextPaymentAmount;
      const startDate = new Date(loan.disbursedAt || new Date());
      
      for (let i = 0; i < loan.termMonths; i++) {
        const dueDate = addMonths(startDate, i + 1);
        const isPaid = isBefore(dueDate, new Date()) && Math.random() > 0.3; // Mock paid status
        
        schedule.push({
          id: `${loan.id}-${i}`,
          loanId: loan.id,
          loanAmount: loan.amount,
          currency: loan.currency,
          amount: monthlyPayment,
          dueDate,
          status: isPaid ? 'paid' : isBefore(dueDate, new Date()) ? 'overdue' : 'pending',
          paymentNumber: i + 1,
          totalPayments: loan.termMonths,
        });
      }
    });
    
    return schedule.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
  };

  const paymentSchedule = generatePaymentSchedule();
  const upcomingPayments = paymentSchedule.filter(p => 
    p.status === 'pending' && isAfter(p.dueDate, new Date())
  ).slice(0, 5);
  const overduePayments = paymentSchedule.filter(p => p.status === 'overdue');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'overdue': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="w-4 h-4" />;
      case 'overdue': return <AlertTriangle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const handlePayment = (payment: any) => {
    setSelectedPayment(payment);
    setShowPaymentModal(true);
  };

  const processPayment = async () => {
    if (!selectedPayment || !paymentMethod) return;
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In production, this would integrate with actual payment processors
    console.log('Processing payment:', { payment: selectedPayment, method: paymentMethod });
    
    setShowPaymentModal(false);
    setSelectedPayment(null);
    setPaymentMethod('');
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Payment</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              KES {upcomingPayments[0]?.amount.toLocaleString() || '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              Due {upcomingPayments[0] ? format(upcomingPayments[0].dueDate, 'MMM dd, yyyy') : 'N/A'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Payments</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overduePayments.length}</div>
            <p className="text-xs text-muted-foreground">
              Total: KES {overduePayments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <CalendarIcon className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              KES {paymentSchedule
                .filter(p => format(p.dueDate, 'yyyy-MM') === format(new Date(), 'yyyy-MM'))
                .reduce((sum, p) => sum + p.amount, 0)
                .toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Across {paymentSchedule.filter(p => 
                format(p.dueDate, 'yyyy-MM') === format(new Date(), 'yyyy-MM')
              ).length} payments
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Payments */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Upcoming Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <DollarSign className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {payment.currency} {payment.amount.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Due {format(payment.dueDate, 'MMM dd, yyyy')}
                      </p>
                      <p className="text-xs text-gray-500">
                        Payment {payment.paymentNumber} of {payment.totalPayments}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(payment.status)}>
                      {getStatusIcon(payment.status)}
                      <span className="ml-1 capitalize">{payment.status}</span>
                    </Badge>
                    <Button 
                      size="sm" 
                      onClick={() => handlePayment(payment)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Pay Now
                    </Button>
                  </div>
                </div>
              ))}
              {upcomingPayments.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No upcoming payments
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Payment Calendar */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Payment Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              modifiers={{
                payment: paymentSchedule.map(p => p.dueDate),
                overdue: overduePayments.map(p => p.dueDate),
                paid: paymentSchedule.filter(p => p.status === 'paid').map(p => p.dueDate),
              }}
              modifiersStyles={{
                payment: { backgroundColor: '#fef3c7', color: '#d97706' },
                overdue: { backgroundColor: '#fecaca', color: '#dc2626' },
                paid: { backgroundColor: '#d1fae5', color: '#059669' },
              }}
            />
            <div className="mt-4 space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-3 h-3 bg-yellow-200 rounded-full"></div>
                <span>Payment Due</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-3 h-3 bg-red-200 rounded-full"></div>
                <span>Overdue</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-3 h-3 bg-green-200 rounded-full"></div>
                <span>Paid</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* All Payments Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Date</th>
                  <th className="text-left p-2">Amount</th>
                  <th className="text-left p-2">Loan ID</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paymentSchedule.slice(0, 10).map((payment) => (
                  <tr key={payment.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="p-2">{format(payment.dueDate, 'MMM dd, yyyy')}</td>
                    <td className="p-2 font-medium">
                      {payment.currency} {payment.amount.toLocaleString()}
                    </td>
                    <td className="p-2 text-sm text-gray-600 dark:text-gray-300">
                      #{payment.loanId}
                    </td>
                    <td className="p-2">
                      <Badge className={getStatusColor(payment.status)}>
                        {getStatusIcon(payment.status)}
                        <span className="ml-1 capitalize">{payment.status}</span>
                      </Badge>
                    </td>
                    <td className="p-2">
                      {payment.status === 'pending' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handlePayment(payment)}
                        >
                          Pay
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {selectedPayment.currency} {selectedPayment.amount.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Due {format(selectedPayment.dueDate, 'MMM dd, yyyy')}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Payment Method</label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mpesa">
                      <div className="flex items-center space-x-2">
                        <Smartphone className="w-4 h-4" />
                        <span>M-Pesa</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="crypto">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4" />
                        <span>Cryptocurrency</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="card">
                      <div className="flex items-center space-x-2">
                        <CreditCard className="w-4 h-4" />
                        <span>Debit/Credit Card</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

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
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={!paymentMethod}
                >
                  Pay Now
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}