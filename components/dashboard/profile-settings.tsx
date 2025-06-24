'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useUser } from '@/lib/hooks/use-user';
import { useAccount, useDisconnect } from 'wagmi';
import { 
  User, 
  Shield, 
  Bell, 
  CreditCard, 
  Smartphone, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  LogOut,
  Upload,
  Check,
  AlertTriangle,
  Info
} from 'lucide-react';

const profileSchema = z.object({
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  dateOfBirth: z.string(),
  address: z.string().min(10, 'Address must be at least 10 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  postalCode: z.string().min(5, 'Postal code must be at least 5 characters'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export function ProfileSettings() {
  const { user } = useUser();
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const [isUpdating, setIsUpdating] = useState(false);
  const [notifications, setNotifications] = useState({
    payments: true,
    loans: true,
    marketing: false,
    security: true,
  });

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      email: user?.email || '',
      phone: user?.phone || '',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      address: '',
      city: '',
      postalCode: '',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    setIsUpdating(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Profile updated:', data);
    setIsUpdating(false);
  };

  const handleKYCUpload = async (type: string) => {
    // Simulate KYC document upload
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('KYC document uploaded:', type);
  };

  const creditScoreColor = (score: number) => {
    if (score >= 800) return 'text-green-600';
    if (score >= 740) return 'text-blue-600';
    if (score >= 670) return 'text-yellow-600';
    if (score >= 580) return 'text-orange-600';
    return 'text-red-600';
  };

  const creditScoreLabel = (score: number) => {
    if (score >= 800) return 'Excellent';
    if (score >= 740) return 'Good';
    if (score >= 670) return 'Fair';
    if (score >= 580) return 'Poor';
    return 'Bad';
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          {/* Profile Overview */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5 text-blue-600" />
                <span>Profile Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your first name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your last name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Enter your email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="+254 712 345 678" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Birth</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div></div>
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your full address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your city" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postal Code</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter postal code" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="bg-green-600 hover:bg-green-700"
                    disabled={isUpdating}
                  >
                    {isUpdating ? 'Updating...' : 'Update Profile'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* KYC Status */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-600" />
                <span>KYC Verification</span>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  <Check className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Identity Document</span>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      <Check className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    National ID or Passport uploaded and verified
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    <Upload className="w-4 h-4 mr-2" />
                    Re-upload
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Proof of Address</span>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      <Check className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    Utility bill or bank statement verified
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    <Upload className="w-4 h-4 mr-2" />
                    Re-upload
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Income Verification</span>
                    <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Optional
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    Upload for higher credit limits
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => handleKYCUpload('income')}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          {/* Wallet Information */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-blue-600" />
                <span>Wallet & Security</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <CreditCard className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">Connected Wallet</span>
                </div>
                <p className="font-mono text-sm">{address}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                  Your wallet is securely connected and verified
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Security Features</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Two-Factor Authentication</span>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        <Check className="w-3 h-3 mr-1" />
                        Enabled
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Email Verification</span>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        <Check className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Phone Verification</span>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        <Check className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Recent Activity</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Last login</span>
                      <span className="text-gray-600 dark:text-gray-300">2 hours ago</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Password changed</span>
                      <span className="text-gray-600 dark:text-gray-300">30 days ago</span>
                    </div>
                    <div className="flex justify-between">
                      <span>KYC verified</span>
                      <span className="text-gray-600 dark:text-gray-300">45 days ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Credit Score */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span>Credit Score</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className={`text-4xl font-bold ${creditScoreColor(user?.creditScore || 0)}`}>
                  {user?.creditScore}
                </div>
                <div className="text-lg text-gray-600 dark:text-gray-300">
                  {creditScoreLabel(user?.creditScore || 0)}
                </div>
                <Progress 
                  value={((user?.creditScore || 0) / 850) * 100} 
                  className="mt-4 max-w-md mx-auto" 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    KES {user?.totalRepaid.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Total Repaid</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {user?.activeLoans}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Active Loans</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    98.5%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Payment Rate</div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Info className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-green-800 dark:text-green-200">
                    Credit Score Tips
                  </span>
                </div>
                <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                  <li>• Make payments on time to improve your score</li>
                  <li>• Keep credit utilization below 30%</li>
                  <li>• Complete additional KYC verification</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-yellow-600" />
                <span>Notification Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Payment Reminders</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Get notified about upcoming payments
                    </p>
                  </div>
                  <Switch
                    checked={notifications.payments}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, payments: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Loan Updates</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Updates about your loan applications and status
                    </p>
                  </div>
                  <Switch
                    checked={notifications.loans}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, loans: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Security Alerts</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Important security notifications and alerts
                    </p>
                  </div>
                  <Switch
                    checked={notifications.security}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, security: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Marketing Communications</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Product updates and promotional offers
                    </p>
                  </div>
                  <Switch
                    checked={notifications.marketing}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, marketing: checked }))
                    }
                  />
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-3">Notification Methods</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Mail className="w-4 h-4 text-blue-600" />
                      <span className="font-medium">Email</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {user?.email || 'Not set'}
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Smartphone className="w-4 h-4 text-green-600" />
                      <span className="font-medium">SMS</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {user?.phone || 'Not set'}
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Bell className="w-4 h-4 text-purple-600" />
                      <span className="font-medium">Push</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Browser notifications
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-600" />
                <span>Account Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Account Information</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Account Created</span>
                      <span className="text-gray-600 dark:text-gray-300">
                        {user?.createdAt.toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Account Status</span>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Active
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>KYC Status</span>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        {user?.kycStatus}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Account Statistics</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Total Borrowed</span>
                      <span className="font-medium">
                        KES {user?.totalBorrowed.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Repaid</span>
                      <span className="font-medium">
                        KES {user?.totalRepaid.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Active Loans</span>
                      <span className="font-medium">{user?.activeLoans}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t">
                <h4 className="font-medium mb-4 text-red-600">Danger Zone</h4>
                <div className="space-y-4">
                  <div className="p-4 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-medium text-red-600">Disconnect Wallet</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Disconnect your wallet from this session
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950"
                        onClick={() => disconnect()}
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Disconnect
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-medium text-red-600">Close Account</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Permanently close your Kelo account
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950"
                        disabled={user?.activeLoans && user.activeLoans > 0}
                      >
                        Close Account
                      </Button>
                    </div>
                    {user?.activeLoans && user.activeLoans > 0 && (
                      <p className="text-xs text-red-600 mt-2">
                        Cannot close account with active loans
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}