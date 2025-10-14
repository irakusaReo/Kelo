export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
  verified_email: boolean;
  kycStatus?: 'pending' | 'approved' | 'rejected';
}

export interface AuthSession {
  [key: string]: any;
  userId: string;
  email: string;
  name: string;
  walletAddress?: string;
  smartWalletId?: string;
  createdAt: Date;
  expiresAt: Date;
  user: GoogleUser;
  wallet?: {
    id: string;
    address: string;
    isActive: boolean;
  };
}