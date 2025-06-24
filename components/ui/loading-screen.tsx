'use client';

import { Loader2 } from 'lucide-react';

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = 'Loading...' }: LoadingScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-900 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-2xl">K</span>
          </div>
          <Loader2 className="absolute inset-0 w-20 h-20 animate-spin text-green-600 opacity-50" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Kelo</h1>
          <p className="text-gray-600 dark:text-gray-300">{message}</p>
        </div>
      </div>
    </div>
  );
}