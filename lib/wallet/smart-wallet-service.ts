import { ethers } from 'ethers';
import { v4 as uuidv4 } from 'uuid';

export interface SmartWalletConfig {
  userId: string;
  email: string;
  name: string;
  recoveryEmail?: string;
  recoveryPhone?: string;
}

export interface SmartWallet {
  id: string;
  address: string;
  userId: string;
  email: string;
  encryptedPrivateKey: string;
  recoveryOptions: {
    email?: string;
    phone?: string;
    securityQuestions?: Array<{
      question: string;
      answerHash: string;
    }>;
  };
  createdAt: Date;
  lastAccessedAt: Date;
  isActive: boolean;
}

export interface WalletCreationResult {
  success: boolean;
  wallet?: SmartWallet;
  error?: string;
}

class SmartWalletService {
  private readonly encryptionKey: string;
  private readonly provider: ethers.JsonRpcProvider;

  constructor() {
    this.encryptionKey = process.env.WALLET_ENCRYPTION_KEY || 'default-encryption-key';
    this.provider = new ethers.JsonRpcProvider(
      process.env.BASE_RPC_URL || 'https://mainnet.base.org'
    );
  }

  /**
   * Create a new smart wallet for a user
   */
  async createSmartWallet(config: SmartWalletConfig): Promise<WalletCreationResult> {
    try {
      // Check if user already has a wallet
      const existingWallet = await this.getWalletByUserId(config.userId);
      if (existingWallet) {
        return {
          success: false,
          error: 'User already has a wallet associated with this account',
        };
      }

      // Generate new wallet
      const wallet = ethers.Wallet.createRandom();
      const walletId = uuidv4();

      // Encrypt private key
      const encryptedPrivateKey = await this.encryptPrivateKey(wallet.privateKey);

      // Create smart wallet record
      const smartWallet: SmartWallet = {
        id: walletId,
        address: wallet.address,
        userId: config.userId,
        email: config.email,
        encryptedPrivateKey,
        recoveryOptions: {
          email: config.recoveryEmail || config.email,
          phone: config.recoveryPhone,
        },
        createdAt: new Date(),
        lastAccessedAt: new Date(),
        isActive: true,
      };

      // Store wallet securely (in production, use encrypted database)
      await this.storeWallet(smartWallet);

      // Initialize wallet on Base network
      await this.initializeWalletOnChain(wallet.address);

      return {
        success: true,
        wallet: smartWallet,
      };
    } catch (error) {
      console.error('Error creating smart wallet:', error);
      return {
        success: false,
        error: 'Failed to create smart wallet. Please try again.',
      };
    }
  }

  /**
   * Get wallet by user ID
   */
  async getWalletByUserId(userId: string): Promise<SmartWallet | null> {
    try {
      // In production, query from secure database
      const wallets = await this.getAllWallets();
      return wallets.find(w => w.userId === userId && w.isActive) || null;
    } catch (error) {
      console.error('Error fetching wallet:', error);
      return null;
    }
  }

  /**
   * Get wallet by email
   */
  async getWalletByEmail(email: string): Promise<SmartWallet | null> {
    try {
      const wallets = await this.getAllWallets();
      return wallets.find(w => w.email === email && w.isActive) || null;
    } catch (error) {
      console.error('Error fetching wallet by email:', error);
      return null;
    }
  }

  /**
   * Recover wallet access
   */
  async recoverWallet(email: string, verificationCode: string): Promise<WalletCreationResult> {
    try {
      const wallet = await this.getWalletByEmail(email);
      if (!wallet) {
        return {
          success: false,
          error: 'No wallet found for this email address',
        };
      }

      // Verify recovery code (in production, implement proper verification)
      const isValidCode = await this.verifyRecoveryCode(email, verificationCode);
      if (!isValidCode) {
        return {
          success: false,
          error: 'Invalid verification code',
        };
      }

      // Update last accessed time
      wallet.lastAccessedAt = new Date();
      await this.updateWallet(wallet);

      return {
        success: true,
        wallet,
      };
    } catch (error) {
      console.error('Error recovering wallet:', error);
      return {
        success: false,
        error: 'Failed to recover wallet. Please try again.',
      };
    }
  }

  /**
   * Get wallet private key (for authorized operations)
   */
  async getWalletPrivateKey(walletId: string, userId: string): Promise<string | null> {
    try {
      const wallet = await this.getWalletByUserId(userId);
      if (!wallet || wallet.id !== walletId) {
        return null;
      }

      return await this.decryptPrivateKey(wallet.encryptedPrivateKey);
    } catch (error) {
      console.error('Error getting wallet private key:', error);
      return null;
    }
  }

  /**
   * Deactivate wallet
   */
  async deactivateWallet(walletId: string, userId: string): Promise<boolean> {
    try {
      const wallet = await this.getWalletByUserId(userId);
      if (!wallet || wallet.id !== walletId) {
        return false;
      }

      wallet.isActive = false;
      await this.updateWallet(wallet);
      return true;
    } catch (error) {
      console.error('Error deactivating wallet:', error);
      return false;
    }
  }

  /**
   * Encrypt private key
   */
  private async encryptPrivateKey(privateKey: string): Promise<string> {
    // In production, use proper encryption like AES-256-GCM
    const encoder = new TextEncoder();
    const data = encoder.encode(privateKey);
    const key = encoder.encode(this.encryptionKey.padEnd(32, '0').slice(0, 32));
    
    // Simple XOR encryption (use proper encryption in production)
    const encrypted = new Uint8Array(data.length);
    for (let i = 0; i < data.length; i++) {
      encrypted[i] = data[i] ^ key[i % key.length];
    }
    
    return Buffer.from(encrypted).toString('base64');
  }

  /**
   * Decrypt private key
   */
  private async decryptPrivateKey(encryptedPrivateKey: string): Promise<string> {
    // In production, use proper decryption
    const encoder = new TextEncoder();
    const encrypted = new Uint8Array(Buffer.from(encryptedPrivateKey, 'base64'));
    const key = encoder.encode(this.encryptionKey.padEnd(32, '0').slice(0, 32));
    
    const decrypted = new Uint8Array(encrypted.length);
    for (let i = 0; i < encrypted.length; i++) {
      decrypted[i] = encrypted[i] ^ key[i % key.length];
    }
    
    return new TextDecoder().decode(decrypted);
  }

  /**
   * Store wallet securely
   */
  private async storeWallet(wallet: SmartWallet): Promise<void> {
    // In production, store in encrypted database
    const wallets = await this.getAllWallets();
    wallets.push(wallet);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('kelo_wallets', JSON.stringify(wallets));
    }
  }

  /**
   * Update wallet
   */
  private async updateWallet(updatedWallet: SmartWallet): Promise<void> {
    const wallets = await this.getAllWallets();
    const index = wallets.findIndex(w => w.id === updatedWallet.id);
    
    if (index !== -1) {
      wallets[index] = updatedWallet;
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('kelo_wallets', JSON.stringify(wallets));
      }
    }
  }

  /**
   * Get all wallets (for demo purposes)
   */
  private async getAllWallets(): Promise<SmartWallet[]> {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('kelo_wallets');
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  }

  /**
   * Initialize wallet on blockchain
   */
  private async initializeWalletOnChain(address: string): Promise<void> {
    // In production, deploy smart contract wallet or register with Coinbase Smart Wallet
    console.log(`Initializing wallet ${address} on Base network`);
    
    // This would typically involve:
    // 1. Deploying a smart contract wallet
    // 2. Setting up recovery mechanisms
    // 3. Configuring spending limits
    // 4. Setting up multi-sig if required
  }

  /**
   * Verify recovery code
   */
  private async verifyRecoveryCode(email: string, code: string): Promise<boolean> {
    // In production, verify against sent recovery code
    // For demo purposes, accept any 6-digit code
    return /^\d{6}$/.test(code);
  }
}

export const smartWalletService = new SmartWalletService();