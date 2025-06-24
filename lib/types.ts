export interface User {
  id: string;
  address: string;
  email?: string;
  phone?: string;
  kycStatus: 'pending' | 'approved' | 'rejected';
  creditScore: number;
  totalBorrowed: number;
  totalRepaid: number;
  activeLoans: number;
  createdAt: Date;
}

export interface Loan {
  id: string;
  userId: string;
  amount: number;
  currency: 'KES' | 'USD' | 'ETH';
  termMonths: number;
  apr: number;
  status: 'pending' | 'active' | 'completed' | 'defaulted';
  disbursedAt?: Date;
  dueDate: Date;
  remainingBalance: number;
  nextPaymentDate: Date;
  nextPaymentAmount: number;
  repayments: Repayment[];
  createdAt: Date;
}

export interface Repayment {
  id: string;
  loanId: string;
  amount: number;
  currency: 'KES' | 'USD' | 'ETH';
  status: 'pending' | 'completed' | 'failed';
  paymentMethod: 'mpesa' | 'crypto' | 'card';
  transactionHash?: string;
  paidAt?: Date;
  dueDate: Date;
}

export interface VaultPosition {
  id: string;
  userId: string;
  amount: number;
  currency: 'KES' | 'USD' | 'ETH';
  apy: number;
  depositedAt: Date;
  claimableYield: number;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'loan_disbursement' | 'repayment' | 'vault_deposit' | 'vault_withdrawal' | 'yield_claim';
  amount: number;
  currency: 'KES' | 'USD' | 'ETH';
  status: 'pending' | 'completed' | 'failed';
  transactionHash?: string;
  createdAt: Date;
}