'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Loan } from '@/lib/types';

export function useLoans() {
  const { address, isConnected } = useAccount();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isConnected || !address) {
      setLoans([]);
      setLoading(false);
      return;
    }

    // Mock loan data - in production, this would fetch from your API
    const mockLoans: Loan[] = [
      {
        id: '1',
        userId: '1',
        amount: 50000,
        currency: 'KES',
        termMonths: 6,
        apr: 15,
        status: 'active',
        disbursedAt: new Date('2024-01-15'),
        dueDate: new Date('2024-07-15'),
        remainingBalance: 35000,
        nextPaymentDate: new Date('2024-03-15'),
        nextPaymentAmount: 8750,
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
        disbursedAt: new Date('2024-02-01'),
        dueDate: new Date('2025-02-01'),
        remainingBalance: 1200,
        nextPaymentDate: new Date('2024-03-01'),
        nextPaymentAmount: 150,
        repayments: [],
        createdAt: new Date('2024-02-01'),
      },
    ];

    setLoans(mockLoans);
    setLoading(false);
  }, [address, isConnected]);

  return { loans, loading };
}