'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useCart } from '@/lib/hooks/use-cart';
import { useAuth } from '@/components/auth/auth-provider';
import { MainLayout } from '@/components/layout/main-layout';
import { PaymentWidget } from '@/components/payment/payment-widget';
import { 
  CreditCard, 
  Smartphone, 
  Wallet, 
  Shield, 
  Truck, 
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Package,
  Clock
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, totalPrice, subtotal, tax, shipping, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');

  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Kenya',
  });

  const [paymentMethod, setPaymentMethod] = useState('bnpl');
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePaymentComplete = async (paymentData: any) => {
    setIsProcessing(true);
    
    try {
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const newOrderId = `ORD-${Date.now().toString().slice(-8)}`;
      setOrderId(newOrderId);
      setOrderComplete(true);
      clearCart();
      
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBackToCart = () => {
    router.push('/cart');
  };

  const handleContinueShopping = () => {
    router.push('/marketplace');
  };

  if (items.length === 0 && !orderComplete) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="max-w-md w-full border-0 shadow-xl text-center">
            <CardHeader>
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
              <CardTitle className="text-2xl">No items to checkout</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                Your cart is empty. Add some items before proceeding to checkout.
              </p>
              <Button 
                onClick={handleContinueShopping}
                className="w-full bg-green-600 hover:bg-green-700"
                size="lg"
              >
                Start Shopping
              </Button>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  if (orderComplete) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full border-0 shadow-xl">
            <CardHeader className="text-center">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <CardTitle className="text-3xl font-bold text-green-600 mb-2">
                Order Confirmed!
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Thank you for your purchase. Your order has been successfully placed.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center p-6 bg-green-50 dark:bg-green-950 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Order Details</h3>
                <p className="text-2xl font-bold text-green-600 mb-1">#{orderId}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Confirmation sent to {shippingInfo.email}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <Truck className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-semibold">Shipping</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Estimated delivery: 3-5 business days
                  </p>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                  <CreditCard className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <h4 className="font-semibold">Payment</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    BNPL payment plan activated
                  </p>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                  <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h4 className="font-semibold">Protection</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    30-day return guarantee
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <Button 
                  onClick={() => router.push('/dashboard?tab=payments')}
                  className="w-full bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  View Payment Schedule
                </Button>
                <Button 
                  onClick={handleContinueShopping}
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  Continue Shopping
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Checkout</h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Complete your purchase securely
                </p>
              </div>
              <Button
                variant="outline"
                onClick={handleBackToCart}
                className="hidden sm:flex"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Cart
              </Button>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              {[1, 2, 3].map((stepNum) => (
                <div key={stepNum} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepNum 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                  }`}>
                    {step > stepNum ? <CheckCircle className="w-4 h-4" /> : stepNum}
                  </div>
                  {stepNum < 3 && (
                    <div className={`w-12 h-1 mx-2 ${
                      step > stepNum ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Step 1: Shipping Information */}
              {step === 1 && (
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Shipping Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleShippingSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            value={shippingInfo.firstName}
                            onChange={(e) => setShippingInfo(prev => ({ ...prev, firstName: e.target.value }))}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            value={shippingInfo.lastName}
                            onChange={(e) => setShippingInfo(prev => ({ ...prev, lastName: e.target.value }))}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={shippingInfo.email}
                          onChange={(e) => setShippingInfo(prev => ({ ...prev, email: e.target.value }))}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+254 712 345 678"
                          value={shippingInfo.phone}
                          onChange={(e) => setShippingInfo(prev => ({ ...prev, phone: e.target.value }))}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          value={shippingInfo.address}
                          onChange={(e) => setShippingInfo(prev => ({ ...prev, address: e.target.value }))}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            value={shippingInfo.city}
                            onChange={(e) => setShippingInfo(prev => ({ ...prev, city: e.target.value }))}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="postalCode">Postal Code</Label>
                          <Input
                            id="postalCode"
                            value={shippingInfo.postalCode}
                            onChange={(e) => setShippingInfo(prev => ({ ...prev, postalCode: e.target.value }))}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="country">Country</Label>
                          <Input
                            id="country"
                            value={shippingInfo.country}
                            disabled
                          />
                        </div>
                      </div>

                      <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" size="lg">
                        Continue to Payment
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}

              {/* Step 2: Payment Method */}
              {step === 2 && (
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Payment Method</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      <div className="space-y-3">
                        <Label
                          htmlFor="bnpl"
                          className={`flex items-center space-x-4 p-4 border-2 rounded-lg cursor-pointer ${
                            paymentMethod === 'bnpl'
                              ? 'border-green-500 bg-green-50 dark:bg-green-950'
                              : 'border-gray-200 dark:border-gray-700'
                          }`}
                        >
                          <RadioGroupItem value="bnpl" id="bnpl" />
                          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">K</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold">Kelo BNPL</span>
                              <Badge className="bg-green-500 text-white">Recommended</Badge>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Pay in 4 interest-free installments
                            </p>
                          </div>
                        </Label>

                        <Label
                          htmlFor="mpesa"
                          className={`flex items-center space-x-4 p-4 border-2 rounded-lg cursor-pointer ${
                            paymentMethod === 'mpesa'
                              ? 'border-green-500 bg-green-50 dark:bg-green-950'
                              : 'border-gray-200 dark:border-gray-700'
                          }`}
                        >
                          <RadioGroupItem value="mpesa" id="mpesa" />
                          <Smartphone className="w-10 h-10 text-green-600" />
                          <div>
                            <span className="font-semibold">M-Pesa</span>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Pay with mobile money
                            </p>
                          </div>
                        </Label>

                        <Label
                          htmlFor="crypto"
                          className={`flex items-center space-x-4 p-4 border-2 rounded-lg cursor-pointer ${
                            paymentMethod === 'crypto'
                              ? 'border-green-500 bg-green-50 dark:bg-green-950'
                              : 'border-gray-200 dark:border-gray-700'
                          }`}
                        >
                          <RadioGroupItem value="crypto" id="crypto" />
                          <Wallet className="w-10 h-10 text-purple-600" />
                          <div>
                            <span className="font-semibold">Cryptocurrency</span>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Pay from your connected wallet
                            </p>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>

                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="terms"
                        checked={agreeToTerms}
                        onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                      />
                      <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-300">
                        I agree to the <span className="text-green-600 underline cursor-pointer">Terms of Service</span> and{' '}
                        <span className="text-green-600 underline cursor-pointer">Privacy Policy</span>
                      </label>
                    </div>

                    <div className="flex space-x-4">
                      <Button 
                        variant="outline" 
                        onClick={() => setStep(1)}
                        className="flex-1"
                      >
                        Back
                      </Button>
                      <Button 
                        onClick={() => setStep(3)}
                        disabled={!agreeToTerms}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        Review Order
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 3: Review & Pay */}
              {step === 3 && (
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Review & Complete Order</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Order Items */}
                    <div>
                      <h3 className="font-semibold mb-3">Order Items</h3>
                      <div className="space-y-3">
                        {items.map((item) => (
                          <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div className="flex-1">
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Qty: {item.quantity} × KES {item.price.toLocaleString()}
                              </p>
                            </div>
                            <p className="font-semibold">
                              KES {(item.price * item.quantity).toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div>
                      <h3 className="font-semibold mb-3">Shipping Address</h3>
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="font-medium">
                          {shippingInfo.firstName} {shippingInfo.lastName}
                        </p>
                        <p>{shippingInfo.address}</p>
                        <p>{shippingInfo.city}, {shippingInfo.postalCode}</p>
                        <p>{shippingInfo.country}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {shippingInfo.email} • {shippingInfo.phone}
                        </p>
                      </div>
                    </div>

                    {/* Payment Method Display */}
                    {paymentMethod === 'bnpl' ? (
                      <div>
                        <h3 className="font-semibold mb-3">Payment</h3>
                        <PaymentWidget
                          amount={totalPrice}
                          merchantName="Kelo Marketplace"
                          productName={`${items.length} item${items.length > 1 ? 's' : ''}`}
                          onPaymentComplete={handlePaymentComplete}
                        />
                      </div>
                    ) : (
                      <div className="flex space-x-4">
                        <Button 
                          variant="outline" 
                          onClick={() => setStep(2)}
                          className="flex-1"
                        >
                          Back
                        </Button>
                        <Button 
                          onClick={() => handlePaymentComplete({})}
                          disabled={isProcessing}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          {isProcessing ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                              Processing...
                            </>
                          ) : (
                            `Pay KES ${totalPrice.toLocaleString()}`
                          )}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>KES {subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (16% VAT)</span>
                      <span>KES {tax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>
                        {shipping === 0 ? (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            FREE
                          </Badge>
                        ) : (
                          `KES ${shipping.toLocaleString()}`
                        )}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>KES {totalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Security Features */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Secure Checkout</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">SSL Encrypted</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Your information is protected
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Truck className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Fast Delivery</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        3-5 business days
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Easy Returns</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        30-day return policy
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}