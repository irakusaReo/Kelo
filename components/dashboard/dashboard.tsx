'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUser } from '@/lib/hooks/use-user';
import { useLoans } from '@/lib/hooks/use-loans';
import { 
  CreditCard, 
  TrendingUp, 
  Wallet, 
  PlusCircle, 
  DollarSign, 
  Clock,
  Shield,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  Calendar,
  Bell,
  Settings,
  ShoppingBag,
  Receipt,
  Zap
} from 'lucide-react';
import { VaultDashboard } from './vault-dashboard';
import { TransactionHistory } from './transaction-history';
import { ProfileSettings } from './profile-settings';

export function Dashboard() {
  const { user, loading: userLoading } = useUser();
  const { loans, loading: loansLoading } = useLoans();
  const [activeTab, setActiveTab] = useState('overview');

  if (userLoading || loansLoading) {
    return <div className="p-8">Loading...</div>;
  }

  const totalSpent = loans.reduce((sum, loan) => sum + loan.amount, 0);
  const totalRemaining = loans.reduce((sum, loan) => sum + loan.remainingBalance, 0);
  const nextPayment = loans.reduce((sum, loan) => sum + loan.nextPaymentAmount, 0);
  const creditUtilization = user ? (totalRemaining / (user.creditScore * 100)) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">K</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-300">Welcome back, {user?.address.slice(0, 6)}...{user?.address.slice(-4)}</p>
              </div>
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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="purchases">Purchases</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="vault">Vault</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Credit Score</CardTitle>
                  <Shield className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{user?.creditScore}</div>
                  <p className="text-xs text-muted-foreground">
                    Excellent credit rating
                  </p>
                  <Progress value={((user?.creditScore || 0) / 850) * 100} className="mt-2" />
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Available Credit</CardTitle>
                  <CreditCard className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">KES {((user?.creditScore || 0) * 100 - totalRemaining).toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    {creditUtilization.toFixed(1)}% utilization
                  </p>
                  <Progress value={creditUtilization} className="mt-2" />
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
                  <ShoppingBag className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">KES {totalSpent.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    Across {loans.length} BNPL purchases
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Next Payment</CardTitle>
                  <Clock className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">KES {nextPayment.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    Due in 15 days
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                    onClick={() => window.location.href = '/marketplace'}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <ShoppingBag className="w-5 h-5 text-green-600" />
                    <span>Shop Marketplace</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">
                    Browse thousands of products with instant BNPL approval
                  </p>
                  <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">
                    Start Shopping
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Wallet className="w-5 h-5 text-blue-600" />
                    <span>Deposit to Vault</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">
                    Earn up to 12% APY on your USDC deposits
                  </p>
                  <Button variant="outline" className="w-full mt-4">
                    Start Earning
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Receipt className="w-5 h-5 text-purple-600" />
                    <span>Make Payment</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">
                    Pay your BNPL installments early and improve your credit score
                  </p>
                  <Button variant="outline" className="w-full mt-4">
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
                      time: '2 hours ago',
                      icon: ArrowDownRight,
                      color: 'text-green-600',
                    },
                    {
                      type: 'purchase',
                      description: 'New BNPL purchase',
                      amount: 'KES 25,000',
                      time: '1 day ago',
                      icon: ShoppingBag,
                      color: 'text-blue-600',
                    },
                    {
                      type: 'yield',
                      description: 'Vault yield claimed',
                      amount: 'USDC 15.50',
                      time: '3 days ago',
                      icon: TrendingUp,
                      color: 'text-purple-600',
                    },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                      <div className={`p-2 rounded-full bg-gray-100 dark:bg-gray-700 ${activity.color}`}>
                        <activity.icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">{activity.description}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{activity.time}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${activity.color}`}>{activity.amount}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="purchases">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ShoppingBag className="w-5 h-5 text-green-600" />
                  <span>Your BNPL Purchases</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loans.map((loan) => (
                    <div key={loan.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">Purchase #{loan.id}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {loan.currency} {loan.amount.toLocaleString()} • {loan.termMonths} months
                        </p>
                        <p className="text-xs text-gray-500">
                          Purchased {loan.disbursedAt?.toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge className={
                          loan.status === 'active' ? 'bg-green-100 text-green-800' :
                          loan.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }>
                          {loan.status}
                        </Badge>
                        <p className="text-sm font-medium mt-1">
                          Remaining: {loan.currency} {loan.remainingBalance.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Receipt className="w-5 h-5 text-purple-600" />
                  <span>Payment Schedule</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loans.map((loan) => (
                    <div key={loan.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold">Purchase #{loan.id}</h3>
                        <Badge variant="outline">
                          Next: {loan.nextPaymentDate.toLocaleDateString()}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Next Payment Amount:</span>
                        <span className="font-bold text-lg">
                          {loan.currency} {loan.nextPaymentAmount.toLocaleString()}
                        </span>
                      </div>
                      <Button size="sm" className="mt-2 bg-purple-600 hover:bg-purple-700">
                        Pay Now
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vault">
            <VaultDashboard />
          </TabsContent>

          <TabsContent value="profile">
            <ProfileSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}