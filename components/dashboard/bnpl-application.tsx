'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUser } from '@/lib/hooks/use-user';
import { 
  ShoppingCart, 
  CreditCard, 
  Zap, 
  ArrowRight,
  Store,
  Smartphone,
  Laptop,
  Home
} from 'lucide-react';

interface BNPLApplicationProps {
  onClose?: () => void;
}

export function BNPLApplication({ onClose }: BNPLApplicationProps) {
  const router = useRouter();
  const { user } = useUser();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const maxPurchaseAmount = user ? user.creditScore * 100 : 50000;

  const featuredCategories = [
    {
      id: 'electronics',
      name: 'Electronics',
      icon: Smartphone,
      description: 'Phones, tablets, and gadgets',
      color: 'from-blue-500 to-cyan-600',
    },
    {
      id: 'computers',
      name: 'Computers',
      icon: Laptop,
      description: 'Laptops, desktops, and accessories',
      color: 'from-purple-500 to-pink-600',
    },
    {
      id: 'home',
      name: 'Home & Garden',
      icon: Home,
      description: 'Furniture, appliances, and decor',
      color: 'from-green-500 to-emerald-600',
    },
  ];

  const handleStartShopping = async (category?: string) => {
    setIsRedirecting(true);
    
    // Simulate brief loading
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const url = category ? `/marketplace?category=${category}` : '/marketplace';
    router.push(url);
    
    if (onClose) {
      onClose();
    }
  };

  if (!onClose) {
    // Standalone component
    return (
      <div className="space-y-6">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ShoppingCart className="w-5 h-5 text-green-600" />
              <span>Shop with BNPL</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BNPLApplicationContent />
          </CardContent>
        </Card>
      </div>
    );
  }

  function BNPLApplicationContent() {
    return (
      <div className="space-y-6">
        {/* Credit Limit Display */}
        <div className="text-center p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-lg">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Zap className="w-5 h-5 text-green-600" />
            <span className="font-semibold text-green-800 dark:text-green-200">Available Credit</span>
          </div>
          <div className="text-3xl font-bold text-green-600 mb-2">
            KES {maxPurchaseAmount.toLocaleString()}
          </div>
          <p className="text-sm text-green-700 dark:text-green-300">
            Ready for instant approval
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-2">
              <Zap className="w-5 h-5 text-blue-600" />
            </div>
            <h4 className="font-semibold mb-1">Instant Approval</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Get approved in 2 seconds</p>
          </div>
          
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-2">
              <CreditCard className="w-5 h-5 text-purple-600" />
            </div>
            <h4 className="font-semibold mb-1">Flexible Payments</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Pay in 4 installments</p>
          </div>
          
          <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-2">
              <Store className="w-5 h-5 text-green-600" />
            </div>
            <h4 className="font-semibold mb-1">Wide Selection</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Thousands of products</p>
          </div>
        </div>

        {/* Featured Categories */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Shop by Category</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featuredCategories.map((category) => (
              <Card 
                key={category.id}
                className="cursor-pointer hover:shadow-md transition-shadow border-0"
                onClick={() => handleStartShopping(category.id)}
              >
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                      <category.icon className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-semibold mb-1">{category.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{category.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Main CTA */}
        <div className="space-y-3">
          <Button 
            onClick={() => handleStartShopping()}
            disabled={isRedirecting}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            size="lg"
          >
            {isRedirecting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Redirecting...
              </>
            ) : (
              <>
                Browse All Products
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
          
          <p className="text-xs text-center text-gray-500">
            No impact on your credit score • Instant approval • Secure checkout
          </p>
        </div>

        {/* How it Works */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h4 className="font-semibold mb-3">How BNPL Works</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
              <span>Shop and add items to your cart</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
              <span>Choose "Pay with Kelo" at checkout</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
              <span>Get instant approval and pay 25% today</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
              <span>Pay the rest in 3 equal installments</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto border-0 shadow-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold flex items-center space-x-2">
              <ShoppingCart className="w-6 h-6 text-green-600" />
              <span>Shop with BNPL</span>
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ×
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <BNPLApplicationContent />
        </CardContent>
      </Card>
    </div>
  );
}