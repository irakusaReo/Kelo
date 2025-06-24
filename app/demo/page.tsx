'use client';

import { useState } from 'react';
import { PurchaseFlow } from '@/components/purchase/purchase-flow';
import { PaymentScheduleView } from '@/components/payment/payment-schedule-view';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { addWeeks, addMonths } from 'date-fns';

const mockItem = {
  id: '1',
  name: 'Premium Wireless Headphones',
  price: 25000,
  image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400',
  merchant: 'TechStore Kenya',
};

export default function DemoPage() {
  const [currentView, setCurrentView] = useState<'purchase' | 'schedule'>('purchase');
  const [payments, setPayments] = useState([
    {
      id: '1',
      amount: 6250,
      dueDate: new Date(),
      status: 'paid' as const,
      paymentNumber: 1,
      totalPayments: 4,
    },
    {
      id: '2',
      amount: 6250,
      dueDate: addWeeks(new Date(), 2),
      status: 'upcoming' as const,
      paymentNumber: 2,
      totalPayments: 4,
    },
    {
      id: '3',
      amount: 6250,
      dueDate: addWeeks(new Date(), 4),
      status: 'upcoming' as const,
      paymentNumber: 3,
      totalPayments: 4,
    },
    {
      id: '4',
      amount: 6250,
      dueDate: addWeeks(new Date(), 6),
      status: 'upcoming' as const,
      paymentNumber: 4,
      totalPayments: 4,
    },
  ]);

  const handlePurchaseComplete = () => {
    setCurrentView('schedule');
  };

  const handlePayNow = (paymentId: string) => {
    setPayments(prev => prev.map(payment => 
      payment.id === paymentId 
        ? { ...payment, status: 'paid' as const }
        : payment
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto py-8">
        {currentView === 'purchase' ? (
          <div>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Kelo Purchase Demo</h1>
              <p className="text-gray-600 dark:text-gray-300">
                Experience the seamless Kelo checkout process
              </p>
            </div>
            <PurchaseFlow 
              item={mockItem} 
              onComplete={handlePurchaseComplete}
            />
          </div>
        ) : (
          <div>
            <div className="flex items-center mb-6">
              <Button
                variant="ghost"
                onClick={() => setCurrentView('purchase')}
                className="mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Purchase
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Payment Schedule</h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Manage your Kelo payments
                </p>
              </div>
            </div>
            <PaymentScheduleView
              payments={payments}
              totalAmount={25000}
              productName={mockItem.name}
              onPayNow={handlePayNow}
            />
          </div>
        )}
      </div>
    </div>
  );
}