import { NextRequest, NextResponse } from 'next/server';
import { googleAuthService } from '@/lib/auth/google-auth';
import { smartWalletService } from '@/lib/wallet/smart-wallet-service';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      );
    }

    // Verify session token
    const session = await googleAuthService.verifySessionToken(token);
    if (!session) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Get user wallet
    const wallet = await smartWalletService.getWalletByUserId(session.userId);

    return NextResponse.json({
      user: {
        id: session.userId,
        email: session.email,
        name: session.name,
      },
      wallet: wallet ? {
        id: wallet.id,
        address: wallet.address,
        isActive: wallet.isActive,
      } : null,
    });
  } catch (error) {
    console.error('Error verifying token:', error);
    return NextResponse.json(
      { error: 'Token verification failed' },
      { status: 500 }
    );
  }
}