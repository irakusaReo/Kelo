'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUser } from '@/lib/hooks/use-user';
import { useBNPL } from '@/lib/hooks/use-bnpl';
import { 
  CreditCard, 
  TrendingUp, 
  Calendar, 
  PlusCircle, 
  Bell, 
  Settings
} from 'lucide-react';
import { BNPLApplication } from './bnpl-application';
import { PaymentSchedule } from './payment-schedule';

export default function Dashboard() {
  const { user, loading: userLoading } = useUser();
  const { purchases, loading: bnplLoading } = useBNPL();
  const [activeTab, setActiveTab] = useState('overview');
  const [showBNPLModal, setShowBNPLModal] = useState(false);

  if (userLoading || bnplLoading) {
    return <div className="p-8">Loading...</div>;
  }

  const totalDebt = purchases.reduce((sum, purchase) => sum + purchase.remainingBalance, 0);
  const nextPayment = purchases.reduce((sum, purchase) => sum + purchase.nextPaymentAmount, 0);
  const creditUtilization = user ? (totalDebt / (user.creditScore * 100)) * 100 : 0;

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-300">Welcome back, {user?.address.slice(0, 6)}...{user?.address.slice(-4)}</p>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="outline" size="sm">
                  <Bell className="w-4 h-4 mr-2" />
                  Notifications
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="bnpl">BNPL</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-0 shadow-lg">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Outstanding</CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">KES {totalDebt.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      Across {purchases.length} active purchases
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Next Payment</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">KES {nextPayment.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Due in 7 days</p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Credit Utilization</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{creditUtilization.toFixed(1)}%</div>
                    <p className="text-xs text-muted-foreground">Good standing</p>
                  </CardContent>
                </Card>
              </div>

              {/* Action Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                      onClick={() => setShowBNPLModal(true)}>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <PlusCircle className="w-5 h-5 text-green-600" />
                      <span>Shop with BNPL</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300">
                      Get instant approval for purchases up to KES {((user?.creditScore || 0) * 100).toLocaleString()}
                    </p>
                    <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">
                      Start Shopping
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <span>Make Payment</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300">
                      Pay your BNPL purchases early and improve your credit score
                    </p>
                    <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                      Pay Now
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        type: 'payment',
                        description: 'BNPL payment received',
                        amount: 'KES 8,750',
                        date: '2 hours ago'
                      },
                      {
                        type: 'purchase',
                        description: 'New purchase completed',
                        amount: 'USD 1,500',
                        date: '1 day ago'
                      }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div>
                          <p className="font-medium">{activity.description}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{activity.date}</p>
                        </div>
                        <span className="font-bold text-green-600">{activity.amount}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bnpl">
              <BNPLApplication />
            </TabsContent>

            <TabsContent value="payments">
              <PaymentSchedule />
            </TabsContent>

            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle>Transaction History</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Transaction history will be displayed here.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Profile settings will be displayed here.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Application Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Application settings will be displayed here.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* BNPL Application Modal */}
        {showBNPLModal && (
          <BNPLApplication onClose={() => setShowBNPLModal(false)} />
        )}
      </div>
    </MainLayout>
  );
}