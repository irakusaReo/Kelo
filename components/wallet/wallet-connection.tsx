'use client';

import { useConnect, useAccount } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GoogleAuthButton } from '@/components/auth/google-auth-button';
import { Separator } from '@/components/ui/separator';
import { Wallet, Smartphone, Shield, X, Zap } from 'lucide-react';
import { useState } from 'react';

interface WalletConnectionProps {
  onClose: () => void;
}

export function WalletConnection({ onClose }: WalletConnectionProps) {
  const { connect, connectors, isPending } = useConnect();
  const { isConnected } = useAccount();
  const [selectedConnector, setSelectedConnector] = useState<string | null>(null);

  if (isConnected) {
    onClose();
    return null;
  }

  const handleConnect = (connector: any) => {
    setSelectedConnector(connector.id);
    connect({ connector });
  };

  const getConnectorIcon = (connectorId: string) => {
    switch (connectorId) {
      case 'coinbaseWalletSDK':
        return <Wallet className="w-8 h-8" />;
      case 'injected':
        return <Smartphone className="w-8 h-8" />;
      default:
        return <Shield className="w-8 h-8" />;
    }
  };

  const getConnectorDescription = (connectorId: string) => {
    switch (connectorId) {
      case 'coinbaseWalletSDK':
        return 'Connect with Coinbase Wallet for the best experience';
      case 'injected':
        return 'Connect with your browser wallet (MetaMask, etc.)';
      default:
        return 'Connect with your preferred wallet';
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">Connect to Kelo</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          <p className="text-gray-600 dark:text-gray-300 text-center">
            Choose how you'd like to connect to Kelo
          </p>
          
          {/* Google Sign-In Option */}
          <Card className="border-2 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Recommended</CardTitle>
                  <CardDescription>
                    Quick setup with automatic wallet creation
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <GoogleAuthButton 
                onSuccess={onClose}
                size="lg"
                className="w-full"
              />
              <div className="mt-3 text-xs text-green-700 dark:text-green-300">
                ✓ No crypto experience needed • ✓ Instant setup • ✓ Secure smart wallet
              </div>
            </CardContent>
          </Card>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-gray-900 px-2 text-gray-500">
                Or connect existing wallet
              </span>
            </div>
          </div>
          
          {/* Existing Wallet Options */}
          <div className="space-y-3">
            {connectors.map((connector) => (
              <Card 
                key={connector.id} 
                className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-green-200 dark:hover:border-green-800"
                onClick={() => handleConnect(connector)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                      {getConnectorIcon(connector.id)}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{connector.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {getConnectorDescription(connector.id)}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button 
                    variant="outline"
                    className="w-full" 
                    disabled={isPending}
                    loading={isPending && selectedConnector === connector.id}
                  >
                    {isPending && selectedConnector === connector.id 
                      ? 'Connecting...' 
                      : 'Connect'
                    }
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <div className="flex items-start space-x-2">
              <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <p className="font-medium mb-1">Secure Connection</p>
                <p>We never store your private keys. Your wallet remains fully under your control.</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}