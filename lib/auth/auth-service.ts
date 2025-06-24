import { GoogleUser, AuthSession } from './auth-types';

export interface AuthenticationState {
  step: 'idle' | 'authenticating' | 'creating-wallet' | 'verifying' | 'complete' | 'error';
  progress: number;
  message: string;
  error?: string;
}

export interface AuthenticationFlow {
  startAuthentication(): Promise<void>;
  handleAuthCallback(code: string): Promise<AuthSession>;
  verifyAuthentication(token: string): Promise<AuthSession | null>;
  createWallet(user: GoogleUser): Promise<any>;
  completeAuthentication(user: GoogleUser, wallet: any): Promise<string>;
}

class AuthService implements AuthenticationFlow {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  }

  async startAuthentication(): Promise<void> {
    // This method opens the Google OAuth popup
    const authUrl = `${this.baseUrl}/api/auth/google?popup=true`;
    
    const popup = window.open(
      authUrl,
      'google-auth',
      'width=500,height=600,scrollbars=yes,resizable=yes'
    );

    if (!popup) {
      throw new Error('Failed to open authentication popup. Please allow popups for this site.');
    }

    return new Promise((resolve, reject) => {
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          reject(new Error('Authentication was cancelled'));
        }
      }, 1000);

      // Listen for messages from popup
      const handleMessage = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;

        if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
          clearInterval(checkClosed);
          window.removeEventListener('message', handleMessage);
          popup.close();
          resolve();
        } else if (event.data.type === 'GOOGLE_AUTH_ERROR') {
          clearInterval(checkClosed);
          window.removeEventListener('message', handleMessage);
          popup.close();
          reject(new Error(event.data.error));
        }
      };

      window.addEventListener('message', handleMessage);
    });
  }

  async handleAuthCallback(code: string): Promise<AuthSession> {
    const response = await fetch('/api/auth/callback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Authentication failed' }));
      throw new Error(error.error || 'Failed to process authentication');
    }

    return response.json();
  }

  async verifyAuthentication(token: string): Promise<AuthSession | null> {
    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        return null;
      }

      return response.json();
    } catch (error) {
      console.error('Token verification failed:', error);
      return null;
    }
  }

  async createWallet(user: GoogleUser): Promise<any> {
    // Simulate wallet creation process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In production, this would call the smart wallet service
    return {
      id: `wallet_${Date.now()}`,
      address: `0x${Math.random().toString(16).substr(2, 40)}`,
      isActive: true,
    };
  }

  async completeAuthentication(user: GoogleUser, wallet: any): Promise<string> {
    // Create session token
    const response = await fetch('/api/auth/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user, wallet }),
    });

    if (!response.ok) {
      throw new Error('Failed to create session');
    }

    const { token } = await response.json();
    return token;
  }

  async signOut(): Promise<void> {
    const token = localStorage.getItem('kelo_auth_token');
    
    if (token) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error('Logout request failed:', error);
      }
    }

    localStorage.removeItem('kelo_auth_token');
  }

  getStoredToken(): string | null {
    return localStorage.getItem('kelo_auth_token');
  }

  storeToken(token: string): void {
    localStorage.setItem('kelo_auth_token', token);
  }

  clearToken(): void {
    localStorage.removeItem('kelo_auth_token');
  }
}

export const authService = new AuthService();