'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Search, 
  Filter, 
  Download, 
  ArrowUpRight, 
  ArrowDownRight, 
  CreditCard, 
  Wallet, 
  TrendingUp,
  ExternalLink,
  Calendar,
  DollarSign
} from 'lucide-react';
import { format } from 'date-fns';

export function TransactionHistory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Mock transaction data
  const transactions = [
    {
      id: 'tx_1',
      type: 'loan_disbursement',
      amount: 50000,
      currency: 'KES',
      status: 'completed',
      transactionHash: '0x1234567890abcdef1234567890abcdef12345678',
      createdAt: new Date('2024-01-15T10:30:00'),
      description: 'Loan disbursement for purchase',
      fee: 250,
      recipient: 'Your Account',
    },
    {
      id: 'tx_2',
      type: 'repayment',
      amount: 8750,
      currency: 'KES',
      status: 'completed',
      transactionHash: '0xabcdef1234567890abcdef1234567890abcdef12',
      createdAt: new Date('2024-02-15T14:20:00'),
      description: 'Monthly loan repayment',
      fee: 0,
      paymentMethod: 'M-Pesa',
    },
    {
      id: 'tx_3',
      type: 'vault_deposit',
      amount: 1.5,
      currency: 'ETH',
      status: 'completed',
      transactionHash: '0x567890abcdef1234567890abcdef1234567890ab',
      createdAt: new Date('2024-01-20T09:15:00'),
      description: 'Vault deposit for yield generation',
      fee: 0.002,
      apy: 15.2,
    },
    {
      id: 'tx_4',
      type: 'yield_claim',
      amount: 0.057,
      currency: 'ETH',
      status: 'completed',
      transactionHash: '0x890abcdef1234567890abcdef1234567890abcdef',
      createdAt: new Date('2024-03-01T16:45:00'),
      description: 'Yield claim from vault',
      fee: 0.001,
      yieldPeriod: '40 days',
    },
    {
      id: 'tx_5',
      type: 'repayment',
      amount: 8750,
      currency: 'KES',
      status: 'pending',
      createdAt: new Date('2024-03-15T12:30:00'),
      description: 'Monthly loan repayment',
      fee: 0,
      paymentMethod: 'M-Pesa',
    },
    {
      id: 'tx_6',
      type: 'loan_disbursement',
      amount: 1500,
      currency: 'USD',
      status: 'completed',
      transactionHash: '0xdef1234567890abcdef1234567890abcdef123456',
      createdAt: new Date('2024-02-01T11:00:00'),
      description: 'Emergency loan disbursement',
      fee: 15,
      recipient: 'Your Account',
    },
  ];

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'loan_disbursement':
        return <ArrowDownRight className="w-4 h-4 text-green-600" />;
      case 'repayment':
        return <ArrowUpRight className="w-4 h-4 text-red-600" />;
      case 'vault_deposit':
        return <Wallet className="w-4 h-4 text-blue-600" />;
      case 'vault_withdrawal':
        return <ArrowUpRight className="w-4 h-4 text-orange-600" />;
      case 'yield_claim':
        return <TrendingUp className="w-4 h-4 text-purple-600" />;
      default:
        return <DollarSign className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'loan_disbursement':
        return 'text-green-600';
      case 'repayment':
        return 'text-red-600';
      case 'vault_deposit':
        return 'text-blue-600';
      case 'vault_withdrawal':
        return 'text-orange-600';
      case 'yield_claim':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const formatTransactionType = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tx.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || tx.type === filterType;
    const matchesStatus = filterStatus === 'all' || tx.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleViewDetails = (transaction: any) => {
    setSelectedTransaction(transaction);
    setShowDetails(true);
  };

  const exportTransactions = () => {
    // In production, this would generate and download a CSV/PDF
    console.log('Exporting transactions:', filteredTransactions);
  };

  const openBlockExplorer = (hash: string) => {
    // In production, this would open the actual block explorer
    window.open(`https://basescan.org/tx/${hash}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transactions.length}</div>
            <p className="text-xs text-muted-foreground">
              This month: {transactions.filter(tx => 
                format(tx.createdAt, 'yyyy-MM') === format(new Date(), 'yyyy-MM')
              ).length}
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,750</div>
            <p className="text-xs text-muted-foreground">
              Equivalent USD value
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Calendar className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {transactions.filter(tx => tx.status === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting confirmation
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.5%</div>
            <p className="text-xs text-muted-foreground">
              Transaction success rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <CardTitle>Transaction History</CardTitle>
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full md:w-64"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="loan_disbursement">Loan Disbursement</SelectItem>
                  <SelectItem value="repayment">Repayment</SelectItem>
                  <SelectItem value="vault_deposit">Vault Deposit</SelectItem>
                  <SelectItem value="vault_withdrawal">Vault Withdrawal</SelectItem>
                  <SelectItem value="yield_claim">Yield Claim</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={exportTransactions}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTransactions.map((transaction) => (
              <div 
                key={transaction.id} 
                className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleViewDetails(transaction)}
              >
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium">{formatTransactionType(transaction.type)}</h3>
                      <Badge className={getStatusColor(transaction.status)}>
                        {transaction.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {transaction.description}
                    </p>
                    <p className="text-xs text-gray-500">
                      {format(transaction.createdAt, 'MMM dd, yyyy at HH:mm')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-semibold ${getTransactionColor(transaction.type)}`}>
                    {transaction.type === 'repayment' ? '-' : '+'}
                    {transaction.currency} {transaction.amount.toLocaleString()}
                  </div>
                  {transaction.transactionHash && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        openBlockExplorer(transaction.transactionHash!);
                      }}
                      className="text-xs p-0 h-auto"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      View on Explorer
                    </Button>
                  )}
                </div>
              </div>
            ))}
            {filteredTransactions.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No transactions found matching your criteria.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Transaction Details Modal */}
      {showDetails && selectedTransaction && (
        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                {getTransactionIcon(selectedTransaction.type)}
                <span>{formatTransactionType(selectedTransaction.type)}</span>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Transaction Amount */}
              <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className={`text-3xl font-bold ${getTransactionColor(selectedTransaction.type)}`}>
                  {selectedTransaction.type === 'repayment' ? '-' : '+'}
                  {selectedTransaction.currency} {selectedTransaction.amount.toLocaleString()}
                </div>
                <Badge className={getStatusColor(selectedTransaction.status)}>
                  {selectedTransaction.status}
                </Badge>
              </div>

              {/* Transaction Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Transaction ID</label>
                  <p className="font-mono text-sm">{selectedTransaction.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Date & Time</label>
                  <p>{format(selectedTransaction.createdAt, 'MMM dd, yyyy at HH:mm:ss')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Type</label>
                  <p>{formatTransactionType(selectedTransaction.type)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Currency</label>
                  <p>{selectedTransaction.currency}</p>
                </div>
                {selectedTransaction.fee && (
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Fee</label>
                    <p>{selectedTransaction.currency} {selectedTransaction.fee}</p>
                  </div>
                )}
                {selectedTransaction.paymentMethod && (
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Payment Method</label>
                    <p>{selectedTransaction.paymentMethod}</p>
                  </div>
                )}
              </div>

              {/* Blockchain Info */}
              {selectedTransaction.transactionHash && (
                <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center space-x-2">
                    <ExternalLink className="w-4 h-4" />
                    <span>Blockchain Information</span>
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Transaction Hash</label>
                      <p className="font-mono text-sm break-all">{selectedTransaction.transactionHash}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openBlockExplorer(selectedTransaction.transactionHash)}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View on Block Explorer
                    </Button>
                  </div>
                </div>
              )}

              {/* Additional Info */}
              {(selectedTransaction.apy || selectedTransaction.yieldPeriod) && (
                <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                  <h4 className="font-medium mb-2">Yield Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedTransaction.apy && (
                      <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-300">APY</label>
                        <p>{selectedTransaction.apy}%</p>
                      </div>
                    )}
                    {selectedTransaction.yieldPeriod && (
                      <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Yield Period</label>
                        <p>{selectedTransaction.yieldPeriod}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <Button onClick={() => setShowDetails(false)}>
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}