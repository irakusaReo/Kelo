'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PaymentWidget } from '@/components/payment/payment-widget';
import { 
  Store, 
  Code, 
  Zap, 
  Shield, 
  TrendingUp,
  Copy,
  CheckCircle,
  ExternalLink,
  Settings,
  BarChart3
} from 'lucide-react';

export function MerchantIntegration() {
  const [apiKey, setApiKey] = useState('kelo_live_sk_1234567890abcdef');
  const [copied, setCopied] = useState(false);
  const [testMode, setTestMode] = useState(true);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const integrationCode = `
// Install Kelo SDK
npm install @kelo/checkout-sdk

// Initialize Kelo
import { KeloCheckout } from '@kelo/checkout-sdk';

const kelo = new KeloCheckout({
  apiKey: '${apiKey}',
  environment: '${testMode ? 'sandbox' : 'production'}'
});

// Create payment session
const session = await kelo.createPaymentSession({
  amount: 25000, // Amount in KES cents
  currency: 'KES',
  productName: 'Wireless Headphones',
  merchantName: 'TechStore Kenya',
  successUrl: 'https://yourstore.com/success',
  cancelUrl: 'https://yourstore.com/cancel'
});

// Redirect to Kelo checkout
window.location.href = session.checkoutUrl;
  `.trim();

  const webhookCode = `
// Webhook endpoint to handle payment updates
app.post('/webhooks/kelo', (req, res) => {
  const { event, data } = req.body;
  
  switch (event) {
    case 'payment.completed':
      // Payment successful - fulfill order
      fulfillOrder(data.orderId);
      break;
      
    case 'payment.failed':
      // Payment failed - handle accordingly
      handleFailedPayment(data.orderId);
      break;
      
    case 'installment.paid':
      // Installment payment received
      updatePaymentStatus(data.paymentId);
      break;
  }
  
  res.status(200).send('OK');
});
  `.trim();

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
          Kelo for Merchants
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Integrate Kelo's Buy Now, Pay Later solution into your store and increase sales by up to 40%
        </p>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center">
            <TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-2" />
            <CardTitle>Increase Sales</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-3xl font-bold text-green-600 mb-2">+40%</p>
            <p className="text-gray-600 dark:text-gray-400">
              Average increase in conversion rates with Kelo
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center">
            <Zap className="w-12 h-12 text-blue-600 mx-auto mb-2" />
            <CardTitle>Instant Approval</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-3xl font-bold text-blue-600 mb-2">2s</p>
            <p className="text-gray-600 dark:text-gray-400">
              Average approval time for customers
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center">
            <Shield className="w-12 h-12 text-purple-600 mx-auto mb-2" />
            <CardTitle>Risk-Free</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-3xl font-bold text-purple-600 mb-2">0%</p>
            <p className="text-gray-600 dark:text-gray-400">
              Merchant risk - we handle all payments
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Integration Tabs */}
      <Tabs defaultValue="demo" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="demo">Live Demo</TabsTrigger>
          <TabsTrigger value="integration">Integration</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        </TabsList>

        {/* Live Demo */}
        <TabsContent value="demo" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Store className="w-5 h-5 text-pink-500" />
                <span>Live Demo - TechStore Kenya</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Product Demo */}
                <div className="space-y-4">
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6">
                    <img 
                      src="https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400"
                      alt="Wireless Headphones"
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <h3 className="text-xl font-bold mb-2">Premium Wireless Headphones</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      High-quality noise-canceling headphones with 30-hour battery life
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold">KES 25,000</span>
                      <Badge className="bg-green-100 text-green-800">In Stock</Badge>
                    </div>
                    
                    {/* Traditional Payment Button */}
                    <Button variant="outline" className="w-full mb-2" disabled>
                      Pay Full Amount - KES 25,000
                    </Button>
                    
                    {/* Kelo Payment Widget */}
                    <PaymentWidget
                      amount={25000}
                      merchantName="TechStore Kenya"
                      productName="Premium Wireless Headphones"
                      onPaymentComplete={(data) => {
                        console.log('Payment completed:', data);
                      }}
                    />
                  </div>
                </div>

                {/* Benefits */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold">Why customers choose Kelo:</h4>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium">No upfront payment required</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Start using the product immediately
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium">Flexible payment options</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Choose from 4 weeks to 12 months
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium">Build credit score</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Improve creditworthiness with each payment
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium">Secure & transparent</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Blockchain-secured with clear terms
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integration Guide */}
        <TabsContent value="integration" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Code className="w-5 h-5 text-blue-500" />
                <span>Quick Integration</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* API Key */}
              <div>
                <Label htmlFor="apiKey">API Key</Label>
                <div className="flex space-x-2 mt-1">
                  <Input
                    id="apiKey"
                    value={apiKey}
                    readOnly
                    className="font-mono"
                  />
                  <Button
                    variant="outline"
                    onClick={() => copyToClipboard(apiKey)}
                  >
                    {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              {/* Code Example */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Integration Code</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(integrationCode)}
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Copy
                  </Button>
                </div>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                  <pre className="text-sm">
                    <code>{integrationCode}</code>
                  </pre>
                </div>
              </div>

              {/* Integration Steps */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                    1
                  </div>
                  <h4 className="font-semibold mb-1">Install SDK</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Add Kelo SDK to your project
                  </p>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                  <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                    2
                  </div>
                  <h4 className="font-semibold mb-1">Configure</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Set up your API keys and settings
                  </p>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                  <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                    3
                  </div>
                  <h4 className="font-semibold mb-1">Go Live</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Start accepting Kelo payments
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Webhooks */}
        <TabsContent value="webhooks" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                <span>Webhook Integration</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-gray-600 dark:text-gray-400">
                Set up webhooks to receive real-time notifications about payment events.
              </p>

              {/* Webhook URL */}
              <div>
                <Label htmlFor="webhookUrl">Webhook URL</Label>
                <Input
                  id="webhookUrl"
                  placeholder="https://yourstore.com/webhooks/kelo"
                  className="mt-1"
                />
              </div>

              {/* Webhook Events */}
              <div>
                <Label className="mb-3 block">Webhook Events</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    'payment.completed',
                    'payment.failed',
                    'installment.paid',
                    'installment.failed',
                    'payment.refunded',
                    'payment.disputed'
                  ].map((event) => (
                    <div key={event} className="flex items-center space-x-2 p-2 border rounded">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="font-mono text-sm">{event}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Code Example */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Webhook Handler Example</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(webhookCode)}
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Copy
                  </Button>
                </div>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                  <pre className="text-sm">
                    <code>{webhookCode}</code>
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Dashboard */}
        <TabsContent value="dashboard" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-green-500" />
                <span>Merchant Dashboard</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">KES 2.4M</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Sales</p>
                </div>
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">1,247</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Transactions</p>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">98.5%</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Success Rate</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Dashboard Features:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Real-time Analytics</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Track sales, conversions, and customer behavior
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Payment Management</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Monitor payment status and handle disputes
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Customer Insights</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Understand your customers' payment preferences
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Financial Reports</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Detailed financial reporting and reconciliation
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Access Merchant Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}