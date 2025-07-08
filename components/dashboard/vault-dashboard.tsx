'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Wallet, 
  DollarSign, 
  PlusCircle, 
  MinusCircle,
  Target,
  Shield,
  Zap,
  Calendar,
  BarChart3
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export function VaultDashboard() {
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('KES');

  // Mock vault data
  const vaultPositions = [
    {
      id: '1',
      currency: 'KES',
      amount: 500000,
      apy: 12.5,
      claimableYield: 15625,
      depositedAt: new Date('2024-01-15'),
      icon: '🇰🇪',
    },
    {
      id: '2',
      currency: 'USD',
      amount: 2500,
      apy: 8.7,
      claimableYield: 54.2,
      depositedAt: new Date('2024-02-01'),
      icon: '💵',
    },
    {
      id: '3',
      currency: 'ETH',
      amount: 1.5,
      apy: 15.2,
      claimableYield: 0.057,
      depositedAt: new Date('2024-01-20'),
      icon: '⟠',
    },
  ];

  const totalValueUSD = vaultPositions.reduce((sum, pos) => {
    // Mock conversion rates
    const rates = { KES: 0.0077, USD: 1, ETH: 2400 };
    return sum + (pos.amount * rates[pos.currency as keyof typeof rates]);
  }, 0);

  const totalYieldUSD = vaultPositions.reduce((sum, pos) => {
    const rates = { KES: 0.0077, USD: 1, ETH: 2400 };
    return sum + (pos.claimableYield * rates[pos.currency as keyof typeof rates]);
  }, 0);

  // Mock historical data
  const yieldHistory = [
    { date: '2024-01', yield: 2400, deposits: 450000 },
    { date: '2024-02', yield: 2850, deposits: 480000 },
    { date: '2024-03', yield: 3200, deposits: 520000 },
    { date: '2024-04', yield: 3600, deposits: 550000 },
    { date: '2024-05', yield: 4100, deposits: 580000 },
    { date: '2024-06', yield: 4500, deposits: 600000 },
  ];

  const allocationData = [
    { name: 'KES', value: 65, color: '#10B981' },
    { name: 'USD', value: 25, color: '#3B82F6' },
    { name: 'ETH', value: 10, color: '#8B5CF6' },
  ];

  const handleDeposit = async () => {
    if (!depositAmount || !selectedCurrency) return;
    
    // Simulate deposit transaction
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Deposit processed:', { amount: depositAmount, currency: selectedCurrency });
    setShowDepositModal(false);
    setDepositAmount('');
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || !selectedCurrency) return;
    
    // Simulate withdrawal transaction
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Withdrawal processed:', { amount: withdrawAmount, currency: selectedCurrency });
    setShowWithdrawModal(false);
    setWithdrawAmount('');
  };

  const claimYield = async (positionId: string) => {
    // Simulate yield claim transaction
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Yield claimed for position:', positionId);
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deposited</CardTitle>
            <Wallet className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValueUSD.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Across {vaultPositions.length} currencies
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Claimable Yield</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalYieldUSD.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Ready to claim
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average APY</CardTitle>
            <Target className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(vaultPositions.reduce((sum, pos) => sum + pos.apy, 0) / vaultPositions.length).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Weighted average
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(totalValueUSD * 0.1).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Estimated monthly
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Yield Chart */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-green-600" />
              <span>Yield Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={yieldHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="yield" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  dot={{ fill: '#10B981' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Asset Allocation */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-purple-600" />
              <span>Asset Allocation</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={allocationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {allocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              {allocationData.map((item, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                  <div className="text-lg font-bold">{item.value}%</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Positions */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Active Positions</CardTitle>
          <div className="flex space-x-2">
            <Button 
              onClick={() => setShowDepositModal(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Deposit
            </Button>
            <Button 
              variant="outline"
              onClick={() => setShowWithdrawModal(true)}
            >
              <MinusCircle className="w-4 h-4 mr-2" />
              Withdraw
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {vaultPositions.map((position) => (
              <div key={position.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{position.icon}</div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        {position.currency} {position.amount.toLocaleString()}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Deposited {position.depositedAt.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      {position.apy}% APY
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Claimable Yield</p>
                    <p className="text-lg font-semibold text-green-600">
                      {position.currency} {position.claimableYield.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Monthly Earnings</p>
                    <p className="text-lg font-semibold">
                      {position.currency} {((position.amount * position.apy) / 100 / 12).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Time Deposited</p>
                    <p className="text-lg font-semibold">
                      {Math.floor((new Date().getTime() - position.depositedAt.getTime()) / (1000 * 60 * 60 * 24))} days
                    </p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button 
                    onClick={() => claimYield(position.id)}
                    className="bg-green-600 hover:bg-green-700"
                    disabled={position.claimableYield === 0}
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Claim Yield
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Deposit Modal */}
      {showDepositModal && (
        <Dialog open={showDepositModal} onOpenChange={setShowDepositModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <PlusCircle className="w-5 h-5 text-green-600" />
                <span>Deposit to Vault</span>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Amount</label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Currency</label>
                <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="KES">🇰🇪 Kenyan Shilling (KES)</SelectItem>
                    <SelectItem value="USD">💵 US Dollar (USD)</SelectItem>
                    <SelectItem value="ETH">⟠ Ethereum (ETH)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-green-800 dark:text-green-200">Secure Vault</span>
                </div>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Your funds are secured by smart contracts and earn competitive yields automatically.
                </p>
              </div>
              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowDepositModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleDeposit}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={!depositAmount}
                >
                  Deposit
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <Dialog open={showWithdrawModal} onOpenChange={setShowWithdrawModal}>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <MinusCircle className="w-5 h-5 text-orange-600" />
                <span>Withdraw from Vault</span>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Amount</label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Currency</label>
                <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="KES">🇰🇪 Kenyan Shilling (KES)</SelectItem>
                    <SelectItem value="USD">💵 US Dollar (USD)</SelectItem>
                    <SelectItem value="ETH">⟠ Ethereum (ETH)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="w-4 h-4 text-yellow-600" />
                  <span className="font-medium text-yellow-800 dark:text-yellow-200">Withdrawal Notice</span>
                </div>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Withdrawals may take up to 24 hours to process. Unclaimed yield will be automatically included.
                </p>
              </div>
              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowWithdrawModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleWithdraw}
                  className="flex-1 bg-orange-600 hover:bg-orange-700"
                  disabled={!withdrawAmount}
                >
                  Withdraw
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}