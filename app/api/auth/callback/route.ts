import { NextRequest, NextResponse } from 'next/server';
import { googleAuthService } from '@/lib/auth/google-auth';
import { smartWalletService } from '@/lib/wallet/smart-wallet-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const state = searchParams.get('state');

    // Check if this is a popup callback
    const isPopup = searchParams.get('popup') === 'true' || 
                   request.headers.get('sec-fetch-dest') === 'iframe';

    if (error) {
      const errorMessage = error === 'access_denied' 
        ? 'Authentication was cancelled' 
        : `Authentication error: ${error}`;
      
      if (isPopup) {
        return new NextResponse(`
          <!DOCTYPE html>
          <html>
            <head><title>Authentication Error</title></head>
            <body>
              <script>
                if (window.opener) {
                  window.opener.postMessage({
                    type: 'GOOGLE_AUTH_ERROR',
                    error: '${errorMessage}'
                  }, window.location.origin);
                  window.close();
                } else {
                  window.location.href = '/auth/error?error=${encodeURIComponent(error)}';
                }
              </script>
            </body>
          </html>
        `, {
          headers: { 'Content-Type': 'text/html' }
        });
      }
      
      return NextResponse.redirect(
        new URL(`/auth/error?error=${encodeURIComponent(error)}`, request.url)
      );
    }

    if (!code) {
      const errorMessage = 'No authorization code received';
      
      if (isPopup) {
        return new NextResponse(`
          <!DOCTYPE html>
          <html>
            <head><title>Authentication Error</title></head>
            <body>
              <script>
                if (window.opener) {
                  window.opener.postMessage({
                    type: 'GOOGLE_AUTH_ERROR',
                    error: '${errorMessage}'
                  }, window.location.origin);
                  window.close();
                } else {
                  window.location.href = '/auth/error?error=missing_code';
                }
              </script>
            </body>
          </html>
        `, {
          headers: { 'Content-Type': 'text/html' }
        });
      }
      
      return NextResponse.redirect(
        new URL('/auth/error?error=missing_code', request.url)
      );
    }

    // Exchange code for user info
    const user = await googleAuthService.exchangeCodeForToken(code);

    // Check if user already has a wallet
    let wallet = await smartWalletService.getWalletByEmail(user.email);
    
    if (!wallet) {
      // Create new smart wallet for the user
      const walletResult = await smartWalletService.createSmartWallet({
        userId: user.id,
        email: user.email,
        name: user.name,
        recoveryEmail: user.email,
      });

      if (!walletResult.success) {
        const errorMessage = walletResult.error || 'wallet_creation_failed';
        
        if (isPopup) {
          return new NextResponse(`
            <!DOCTYPE html>
            <html>
              <head><title>Wallet Creation Error</title></head>
              <body>
                <script>
                  if (window.opener) {
                    window.opener.postMessage({
                      type: 'GOOGLE_AUTH_ERROR',
                      error: '${errorMessage}'
                    }, window.location.origin);
                    window.close();
                  } else {
                    window.location.href = '/auth/error?error=${encodeURIComponent(errorMessage)}';
                  }
                </script>
              </body>
            </html>
          `, {
            headers: { 'Content-Type': 'text/html' }
          });
        }
        
        return NextResponse.redirect(
          new URL(`/auth/error?error=${encodeURIComponent(errorMessage)}`, request.url)
        );
      }

      wallet = walletResult.wallet!;
    }

    // Create session token
    const sessionToken = await googleAuthService.createSessionToken(
      user,
      wallet.address,
      wallet.id
    );

    if (isPopup) {
      // For popup authentication, return HTML that communicates with parent
      return new NextResponse(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Authentication Successful</title>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100vh;
                margin: 0;
                background: #f0fdf4;
              }
              .container {
                text-align: center;
                padding: 2rem;
                background: white;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              }
              .success {
                color: #16a34a;
                margin-bottom: 1rem;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="success">
                <h2>✓ Authentication Successful</h2>
                <p>Redirecting you back to Kelo...</p>
              </div>
            </div>
            <script>
              // Store token in localStorage
              localStorage.setItem('kelo_auth_token', '${sessionToken}');
              
              // Notify parent window
              if (window.opener) {
                window.opener.postMessage({
                  type: 'GOOGLE_AUTH_SUCCESS',
                  token: '${sessionToken}',
                  user: ${JSON.stringify(user)},
                  wallet: ${JSON.stringify({
                    id: wallet.id,
                    address: wallet.address,
                    isActive: wallet.isActive
                  })}
                }, window.location.origin);
                window.close();
              } else {
                // Fallback: redirect to success page
                window.location.href = '/auth/success';
              }
            </script>
          </body>
        </html>
      `, {
        headers: { 'Content-Type': 'text/html' }
      });
    }

    // For direct navigation, set cookie and redirect
    const response = NextResponse.redirect(new URL('/auth/success', request.url));
    response.cookies.set('kelo_auth_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Error in auth callback:', error);
    
    const errorMessage = 'authentication_failed';
    const isPopup = new URL(request.url).searchParams.get('popup') === 'true';
    
    if (isPopup) {
      return new NextResponse(`
        <!DOCTYPE html>
        <html>
          <head><title>Authentication Error</title></head>
          <body>
            <script>
              if (window.opener) {
                window.opener.postMessage({
                  type: 'GOOGLE_AUTH_ERROR',
                  error: '${errorMessage}'
                }, window.location.origin);
                window.close();
              } else {
                window.location.href = '/auth/error?error=${errorMessage}';
              }
            </script>
          </body>
        </html>
      `, {
        headers: { 'Content-Type': 'text/html' }
      });
    }
    
    return NextResponse.redirect(
      new URL('/auth/error?error=authentication_failed', request.url)
    );
  }
}