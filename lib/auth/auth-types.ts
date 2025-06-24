export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
  verified_email: boolean;
}

export interface AuthSession {
  userId: string;
  email: string;
  name: string;
  walletAddress?: string;
  smartWalletId?: string;
  createdAt: Date;
  expiresAt: Date;
}