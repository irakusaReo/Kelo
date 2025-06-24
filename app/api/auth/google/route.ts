import { NextRequest, NextResponse } from 'next/server';
import { googleAuthService } from '@/lib/auth/google-auth';

export async function GET(request: NextRequest) {
  try {
    // Validate Google OAuth configuration
    const configValidation = googleAuthService.validateConfiguration();
    
    if (!configValidation.isValid) {
      console.error('Google OAuth configuration errors:', configValidation.errors);
      
      const errorHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Configuration Error</title>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100vh;
                margin: 0;
                background: #fef2f2;
              }
              .container {
                text-align: center;
                padding: 2rem;
                background: white;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                max-width: 500px;
              }
              .error {
                color: #dc2626;
                margin-bottom: 1rem;
              }
              .error-list {
                text-align: left;
                background: #fef2f2;
                padding: 1rem;
                border-radius: 4px;
                margin: 1rem 0;
              }
              .error-list li {
                margin: 0.5rem 0;
              }
              button {
                background: #dc2626;
                color: white;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 4px;
                cursor: pointer;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="error">
                <h2>⚠️ OAuth Configuration Error</h2>
                <p>Google OAuth is not properly configured. Please fix the following issues:</p>
                <ul class="error-list">
                  ${configValidation.errors.map(error => `<li>${error}</li>`).join('')}
                </ul>
                <p><strong>To fix this:</strong></p>
                <ol style="text-align: left; margin: 1rem 0;">
                  <li>Go to <a href="https://console.cloud.google.com/apis/credentials" target="_blank">Google Cloud Console</a></li>
                  <li>Create OAuth 2.0 credentials if you haven't already</li>
                  <li>Add your redirect URI: <code>http://localhost:3000/api/auth/callback</code></li>
                  <li>Copy your Client ID and Client Secret to your .env.local file</li>
                  <li>Restart your development server</li>
                </ol>
              </div>
              <button onclick="window.close()">Close</button>
            </div>
            <script>
              if (window.opener) {
                window.opener.postMessage({
                  type: 'GOOGLE_AUTH_ERROR',
                  error: 'OAuth configuration error: ${configValidation.errors.join(', ')}'
                }, window.location.origin);
              }
            </script>
          </body>
        </html>
      `;
      
      return new NextResponse(errorHtml, {
        status: 500,
        headers: {
          'Content-Type': 'text/html',
        },
      });
    }

    // Generate state parameter for security
    const state = Math.random().toString(36).substring(2, 15);
    
    // Get the auth URL
    const authUrl = googleAuthService.getAuthUrl();
    
    // Check if this is a popup request
    const userAgent = request.headers.get('user-agent') || '';
    const isPopup = request.headers.get('sec-fetch-dest') === 'iframe' || 
                   request.headers.get('sec-fetch-mode') === 'navigate' ||
                   request.nextUrl.searchParams.get('popup') === 'true';
    
    if (isPopup) {
      // Return HTML that will handle the OAuth flow in a popup
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Authenticating with Google...</title>
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
              .spinner {
                border: 3px solid #f3f3f3;
                border-top: 3px solid #16a34a;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                animation: spin 1s linear infinite;
                margin: 0 auto 1rem;
              }
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
              .debug-info {
                margin-top: 1rem;
                padding: 1rem;
                background: #f8f9fa;
                border-radius: 4px;
                font-size: 12px;
                text-align: left;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="spinner"></div>
              <h2>🔐 Connecting to Google...</h2>
              <p>Please wait while we redirect you to Google for authentication.</p>
              <div class="debug-info">
                <strong>Debug Info:</strong><br>
                Client ID: ${googleAuthService['clientId'].substring(0, 20)}...<br>
                Redirect URI: ${googleAuthService['redirectUri']}<br>
                Timestamp: ${new Date().toISOString()}
              </div>
            </div>
            <script>
              console.log('Redirecting to Google OAuth...');
              console.log('Auth URL:', '${authUrl}');
              
              // Add a small delay to show the loading screen
              setTimeout(() => {
                window.location.href = '${authUrl}';
              }, 1000);
            </script>
          </body>
        </html>
      `;
      
      return new NextResponse(html, {
        headers: {
          'Content-Type': 'text/html',
        },
      });
    }
    
    // For direct navigation, redirect to Google
    console.log('Redirecting to Google OAuth URL:', authUrl);
    return NextResponse.redirect(authUrl);
    
  } catch (error) {
    console.error('Error initiating Google auth:', error);
    
    // Return detailed error page for debugging
    const errorHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Authentication Error</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              background: #fef2f2;
            }
            .container {
              text-align: center;
              padding: 2rem;
              background: white;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              max-width: 500px;
            }
            .error {
              color: #dc2626;
              margin-bottom: 1rem;
            }
            .error-details {
              background: #fef2f2;
              padding: 1rem;
              border-radius: 4px;
              margin: 1rem 0;
              text-align: left;
              font-family: monospace;
              font-size: 12px;
            }
            button {
              background: #dc2626;
              color: white;
              border: none;
              padding: 0.5rem 1rem;
              border-radius: 4px;
              cursor: pointer;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="error">
              <h2>❌ Authentication Error</h2>
              <p>Failed to initiate Google authentication.</p>
              <div class="error-details">
                Error: ${error instanceof Error ? error.message : 'Unknown error'}<br>
                Time: ${new Date().toISOString()}<br>
                ${error instanceof Error && error.stack ? `Stack: ${error.stack}` : ''}
              </div>
              <p><strong>Common solutions:</strong></p>
              <ul style="text-align: left;">
                <li>Check your .env.local file has the correct GOOGLE_CLIENT_ID</li>
                <li>Verify your Google Cloud Console OAuth configuration</li>
                <li>Ensure the redirect URI matches exactly</li>
                <li>Restart your development server after changing environment variables</li>
              </ul>
            </div>
            <button onclick="window.close()">Close</button>
          </div>
          <script>
            if (window.opener) {
              window.opener.postMessage({
                type: 'GOOGLE_AUTH_ERROR',
                error: 'Failed to initiate authentication: ${error instanceof Error ? error.message : 'Unknown error'}'
              }, window.location.origin);
            }
          </script>
        </body>
      </html>
    `;
    
    return new NextResponse(errorHtml, {
      status: 500,
      headers: {
        'Content-Type': 'text/html',
      },
    });
  }
}