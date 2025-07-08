'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

export interface BNPLPurchase {
  id: string;
  userId: string;
  amount: number;
  currency: 'KES' | 'USD' | 'ETH';
  termMonths: number;
  apr: number;
  status: 'pending' | 'active' | 'completed' | 'defaulted';
  purchasedAt?: Date;
  dueDate: Date;
  remainingBalance: number;
  nextPaymentDate: Date;
  nextPaymentAmount: number;
  productName: string;
  merchantName: string;
  repayments: BNPLRepayment[];
  createdAt: Date;
}

export interface BNPLRepayment {
  id: string;
  purchaseId: string;
  amount: number;
  currency: 'KES' | 'USD' | 'ETH';
  status: 'pending' | 'completed' | 'failed';
  paymentMethod: 'mpesa' | 'crypto' | 'card';
  transactionHash?: string;
  paidAt?: Date;
  dueDate: Date;
}

export function useBNPL() {
  const { address, isConnected } = useAccount();
  const [purchases, setPurchases] = useState<BNPLPurchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isConnected || !address) {
      setPurchases([]);
      setLoading(false);
      return;
    }

    // Mock BNPL purchase data - in production, this would fetch from your API
    const mockPurchases: BNPLPurchase[] = [
      {
        id: '1',
        userId: '1',
        amount: 50000,
        currency: 'KES',
        termMonths: 6,
        apr: 15,
        status: 'active',
        purchasedAt: new Date('2024-01-15'),
        dueDate: new Date('2024-07-15'),
        remainingBalance: 35000,
        nextPaymentDate: new Date('2024-03-15'),
        nextPaymentAmount: 8750,
        productName: 'Premium Wireless Headphones',
        merchantName: 'TechStore Kenya',
        repayments: [],
        createdAt: new Date('2024-01-15'),
      },
      {
        id: '2',
        userId: '1',
        amount: 1500,
        currency: 'USD',
        termMonths: 12,
        apr: 18,
        status: 'active',
        purchasedAt: new Date('2024-02-01'),
        dueDate: new Date('2025-02-01'),
        remainingBalance: 1200,
        nextPaymentDate: new Date('2024-03-01'),
        nextPaymentAmount: 150,
        productName: 'MacBook Air M2',
        merchantName: 'Apple Store Kenya',
        repayments: [],
        createdAt: new Date('2024-02-01'),
      },
    ];

    setPurchases(mockPurchases);
    setLoading(false);
  }, [address, isConnected]);

  return { purchases, loading };
}