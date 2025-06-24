'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { User } from '@/lib/types';

export function useUser() {
  const { address, isConnected } = useAccount();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isConnected || !address) {
      setUser(null);
      setLoading(false);
      return;
    }

    // Mock user data - in production, this would fetch from your API
    const mockUser: User = {
      id: '1',
      address: address,
      email: 'user@example.com',
      phone: '+254712345678',
      kycStatus: 'approved',
      creditScore: 750,
      totalBorrowed: 150000,
      totalRepaid: 120000,
      activeLoans: 2,
      createdAt: new Date('2024-01-15'),
    };

    setUser(mockUser);
    setLoading(false);
  }, [address, isConnected]);

  return { user, loading };
}