import { GoogleAuth } from 'google-auth-library';
import { SignJWT, jwtVerify } from 'jose';
import { GoogleUser, AuthSession } from './auth-types';

/**
 * Google Authentication Service
 * Handles OAuth flow, token management, and session creation
 */
class GoogleAuthService {
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly redirectUri: string;
  private readonly jwtSecret: Uint8Array;

  constructor() {
    // Initialize OAuth configuration from environment variables
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
   * Generate Google OAuth URL for authentication flow
   * Includes required scopes and security state parameter
   */
  getAuthUrl(): string {
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

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  /**
   * Exchange authorization code for user information
   * Handles token exchange and user data retrieval from Google
   */
  async exchangeCodeForToken(code: string): Promise<GoogleUser> {
    try {
      // Exchange authorization code for access token
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

      // Fetch user information using access token
      const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!userResponse.ok) {
        throw new Error('Failed to fetch user info from Google');
      }

      const userData = await userResponse.json();
      return {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        picture: userData.picture,
        verified_email: userData.verified_email,
      };
    } catch (error) {
      throw error instanceof Error ? error : new Error('Authentication failed. Please try again.');
    }
  }

  /**
   * Create JWT session token for authenticated user
   * Token expires after 7 days
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
      user,
    };

    const token = await new SignJWT(session)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(expiresAt)
      .sign(this.jwtSecret);

    return token;
  }

  /**
   * Verify JWT session token and return session data
   * Returns null if token is invalid or expired
   */
  async verifySessionToken(token: string): Promise<AuthSession | null> {
    try {
      const { payload } = await jwtVerify(token, this.jwtSecret);
      return payload as AuthSession;
    } catch (error) {
      return null;
    }
  }

  /**
   * Generate secure random state parameter for OAuth security
   */
  private generateState(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  /**
   * Validate OAuth configuration and return validation results
   * Used for debugging configuration issues
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

    // Validate client ID format
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