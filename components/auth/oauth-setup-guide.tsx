'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  ExternalLink, 
  Copy, 
  CheckCircle, 
  AlertTriangle,
  Settings,
  Key,
  Globe,
  Shield
} from 'lucide-react';

export function OAuthSetupGuide() {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const redirectUri = 'http://localhost:3000/api/auth/callback';
  const origins = ['http://localhost:3000'];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Google OAuth Setup Guide</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Follow these steps to configure Google OAuth for your Kelo application
        </p>
      </div>

      {/* Current Error Alert */}
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Error 400: invalid_request - Missing required parameter: client_id</strong>
          <br />
          This error occurs because your Google OAuth credentials are not properly configured.
        </AlertDescription>
      </Alert>

      {/* Step 1: Google Cloud Console */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-blue-600" />
            <span>Step 1: Google Cloud Console Setup</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Badge variant="outline">1.1</Badge>
              <span>Go to Google Cloud Console</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open('https://console.cloud.google.com/apis/credentials', '_blank')}
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                Open Console
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge variant="outline">1.2</Badge>
              <span>Create a new project or select an existing one</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge variant="outline">1.3</Badge>
              <span>Enable the Google+ API (if not already enabled)</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge variant="outline">1.4</Badge>
              <span>Go to "Credentials" in the left sidebar</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step 2: OAuth Consent Screen */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-green-600" />
            <span>Step 2: Configure OAuth Consent Screen</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Badge variant="outline">2.1</Badge>
              <span>Click "OAuth consent screen" in the left sidebar</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge variant="outline">2.2</Badge>
              <span>Choose "External" user type (for testing)</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge variant="outline">2.3</Badge>
              <span>Fill in the required fields:</span>
            </div>
            
            <div className="ml-8 space-y-2 text-sm">
              <div>• App name: <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">Kelo BNPL Platform</code></div>
              <div>• User support email: <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">ailaowano@gmail.com</code></div>
              <div>• Developer contact email: <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">ailaowano@gmail.com</code></div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge variant="outline">2.4</Badge>
              <span>Add scopes: email, profile, openid</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge variant="outline">2.5</Badge>
              <span>Add test users (including ailaowano@gmail.com)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step 3: Create Credentials */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Key className="w-5 h-5 text-purple-600" />
            <span>Step 3: Create OAuth 2.0 Credentials</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Badge variant="outline">3.1</Badge>
              <span>Click "Credentials" in the left sidebar</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge variant="outline">3.2</Badge>
              <span>Click "+ CREATE CREDENTIALS" → "OAuth client ID"</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge variant="outline">3.3</Badge>
              <span>Choose "Web application" as the application type</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge variant="outline">3.4</Badge>
              <span>Configure the following settings:</span>
            </div>
          </div>

          <div className="space-y-4 ml-8">
            <div>
              <label className="block text-sm font-medium mb-2">Name:</label>
              <div className="flex items-center space-x-2">
                <code className="bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded flex-1">
                  Kelo Web Client
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard('Kelo Web Client', 'name')}
                >
                  {copiedText === 'name' ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Authorized JavaScript origins:</label>
              {origins.map((origin, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <code className="bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded flex-1">
                    {origin}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(origin, `origin-${index}`)}
                  >
                    {copiedText === `origin-${index}` ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  </Button>
                </div>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Authorized redirect URIs:</label>
              <div className="flex items-center space-x-2">
                <code className="bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded flex-1">
                  {redirectUri}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(redirectUri, 'redirect')}
                >
                  {copiedText === 'redirect' ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step 4: Environment Variables */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="w-5 h-5 text-orange-600" />
            <span>Step 4: Configure Environment Variables</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            After creating your OAuth credentials, copy the Client ID and Client Secret to your <code>.env.local</code> file:
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Create/update .env.local file:</label>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <pre className="text-sm">
{`# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_client_id_from_google_console.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret_from_google_console
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/callback

# JWT Configuration (generate a random 32+ character string)
JWT_SECRET=your_super_secret_jwt_key_at_least_32_characters_long

# Wallet Encryption (generate a random 32+ character string)
WALLET_ENCRYPTION_KEY=your_wallet_encryption_key_32_characters_min

# Blockchain Configuration
BASE_RPC_URL=https://mainnet.base.org

# Environment
NODE_ENV=development`}
                </pre>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => copyToClipboard(`# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_client_id_from_google_console.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret_from_google_console
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/callback

# JWT Configuration (generate a random 32+ character string)
JWT_SECRET=your_super_secret_jwt_key_at_least_32_characters_long

# Wallet Encryption (generate a random 32+ character string)
WALLET_ENCRYPTION_KEY=your_wallet_encryption_key_32_characters_min

# Blockchain Configuration
BASE_RPC_URL=https://mainnet.base.org

# Environment
NODE_ENV=development`, 'env')}
              >
                {copiedText === 'env' ? <CheckCircle className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                Copy .env.local template
              </Button>
            </div>
          </div>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Important:</strong> Replace the placeholder values with your actual credentials from Google Cloud Console.
              Never commit your .env.local file to version control.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Step 5: Testing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span>Step 5: Test Your Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Badge variant="outline">5.1</Badge>
              <span>Restart your development server</span>
              <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">npm run dev</code>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge variant="outline">5.2</Badge>
              <span>Try the Google sign-in button</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge variant="outline">5.3</Badge>
              <span>Check the browser console for any error messages</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge variant="outline">5.4</Badge>
              <span>Verify that ailaowano@gmail.com is in your test users list</span>
            </div>
          </div>

          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              If everything is configured correctly, you should be able to sign in with your Google account without seeing the "missing client_id" error.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Troubleshooting */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <span>Troubleshooting Common Issues</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-red-600">Error: "Missing required parameter: client_id"</h4>
              <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 mt-2 space-y-1">
                <li>Check that GOOGLE_CLIENT_ID is set in your .env.local file</li>
                <li>Verify the client ID format (should end with .googleusercontent.com)</li>
                <li>Restart your development server after changing environment variables</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-red-600">Error: "Access blocked: Authorization Error"</h4>
              <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 mt-2 space-y-1">
                <li>Add your email (ailaowano@gmail.com) to the test users list</li>
                <li>Make sure your OAuth consent screen is properly configured</li>
                <li>Check that the redirect URI matches exactly</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-red-600">Error: "redirect_uri_mismatch"</h4>
              <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 mt-2 space-y-1">
                <li>Verify the redirect URI in Google Console matches: {redirectUri}</li>
                <li>Check for trailing slashes or typos</li>
                <li>Ensure the protocol (http/https) matches</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}