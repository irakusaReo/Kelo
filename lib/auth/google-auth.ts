import { GoogleAuth } from 'google-auth-library';
import { SignJWT, jwtVerify } from 'jose';
import { GoogleUser, AuthSession } from './auth-types';

class GoogleAuthService {
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly redirectUri: string;
  private readonly jwtSecret: Uint8Array;

  constructor() {
    // Validate required environment variables
    this.clientId = process.env.GOOGLE_CLIENT_ID || '';
    this.clientSecret = process.env.GOOGLE_CLIENT_SECRET || '';
    this.redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/callback';
    
    if (!this.clientId) {
      throw new Error('GOOGLE_CLIENT_ID environment variable is required');
    }
    
    if (!this.clientSecret) {
      throw new Error('GOOGLE_CLIENT_SECRET environment variable is required');
    }

    const jwtSecretKey = process.env.JWT_SECRET;
    if (!jwtSecretKey || jwtSecretKey.length < 32) {
      throw new Error('JWT_SECRET environment variable must be at least 32 characters long');
    }
    
    this.jwtSecret = new TextEncoder().encode(jwtSecretKey);
  }

  /**
   * Generate Google OAuth URL for authentication
   */
  getAuthUrl(): string {
    // Validate client_id before generating URL
    if (!this.clientId || this.clientId === 'your_actual_google_client_id_here') {
      throw new Error('Google Client ID is not properly configured. Please check your .env.local file.');
    }

    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'consent',
      state: this.generateState(),
    });

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    
    // Log the URL for debugging (remove in production)
    console.log('Generated OAuth URL:', authUrl);
    console.log('Client ID being used:', this.clientId.substring(0, 10) + '...');
    
    return authUrl;
  }

  /**
   * Exchange authorization code for access token and user info
   */
  async exchangeCodeForToken(code: string): Promise<GoogleUser> {
    try {
      console.log('Exchanging code for token...');
      console.log('Using client_id:', this.clientId.substring(0, 10) + '...');
      console.log('Using redirect_uri:', this.redirectUri);

      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          code,
          grant_type: 'authorization_code',
          redirect_uri: this.redirectUri,
        }),
      });

      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.json().catch(() => ({}));
        console.error('Token exchange failed:', {
          status: tokenResponse.status,
          statusText: tokenResponse.statusText,
          error: errorData
        });
        
        if (errorData.error === 'invalid_client') {
          throw new Error('Invalid Google Client ID or Client Secret. Please check your OAuth configuration.');
        }
        
        if (errorData.error === 'invalid_request') {
          throw new Error('Invalid OAuth request. Please check your redirect URI configuration.');
        }
        
        throw new Error(`Failed to exchange code for token: ${errorData.error_description || tokenResponse.statusText}`);
      }

      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.access_token;

      console.log('Token exchange successful, fetching user info...');

      // Get user info from Google
      const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!userResponse.ok) {
        console.error('User info fetch failed:', userResponse.status, userResponse.statusText);
        throw new Error('Failed to fetch user info from Google');
      }

      const userData = await userResponse.json();
      
      console.log('User info fetched successfully:', {
        id: userData.id,
        email: userData.email,
        name: userData.name
      });
      
      return {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        picture: userData.picture,
        verified_email: userData.verified_email,
      };
    } catch (error) {
      console.error('Error exchanging code for token:', error);
      throw error instanceof Error ? error : new Error('Authentication failed. Please try again.');
    }
  }

  /**
   * Create JWT session token
   */
  async createSessionToken(user: GoogleUser, walletAddress?: string, smartWalletId?: string): Promise<string> {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const session: AuthSession = {
      userId: user.id,
      email: user.email,
      name: user.name,
      walletAddress,
      smartWalletId,
      createdAt: new Date(),
      expiresAt,
    };

    const token = await new SignJWT(session)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(expiresAt)
      .sign(this.jwtSecret);

    return token;
  }

  /**
   * Verify and decode JWT session token
   */
  async verifySessionToken(token: string): Promise<AuthSession | null> {
    try {
      const { payload } = await jwtVerify(token, this.jwtSecret);
      return payload as AuthSession;
    } catch (error) {
      console.error('Error verifying session token:', error);
      return null;
    }
  }

  /**
   * Generate secure state parameter for OAuth
   */
  private generateState(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  /**
   * Validate configuration
   */
  validateConfiguration(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.clientId || this.clientId === 'your_actual_google_client_id_here') {
      errors.push('GOOGLE_CLIENT_ID is not configured');
    }

    if (!this.clientSecret || this.clientSecret === 'your_actual_google_client_secret_here') {
      errors.push('GOOGLE_CLIENT_SECRET is not configured');
    }

    if (!this.redirectUri) {
      errors.push('GOOGLE_REDIRECT_URI is not configured');
    }

    // Validate client ID format (should end with .googleusercontent.com)
    if (this.clientId && !this.clientId.includes('.googleusercontent.com')) {
      errors.push('GOOGLE_CLIENT_ID appears to be invalid (should end with .googleusercontent.com)');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export const googleAuthService = new GoogleAuthService();