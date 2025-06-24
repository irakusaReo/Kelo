'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/components/auth/auth-provider';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Upload, 
  FileText, 
  CreditCard,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Info,
  Shield,
  Star,
  Zap,
  DollarSign,
  AlertCircle,
  Loader2
} from 'lucide-react';

// Validation schemas
const personalInfoSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  countryCode: z.string().min(1, 'Please select country code'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  address: z.string().min(10, 'Please enter your full address'),
  city: z.string().min(2, 'City is required'),
  postalCode: z.string().min(4, 'Postal code is required'),
  country: z.string().min(1, 'Country is required'),
});

const creditProfileSchema = z.object({
  monthlyIncome: z.string().optional(),
  employmentStatus: z.string().optional(),
  employer: z.string().optional(),
  creditScore: z.string().optional(),
  hasExistingLoans: z.boolean().optional(),
  existingLoanAmount: z.string().optional(),
});

type PersonalInfoData = z.infer<typeof personalInfoSchema>;
type CreditProfileData = z.infer<typeof creditProfileSchema>;

interface OnboardingFlowProps {
  onComplete: (userData: any) => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [uploadedDocuments, setUploadedDocuments] = useState<Record<string, File>>({});
  const [skipCreditProfile, setSkipCreditProfile] = useState(false);

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  // Personal Information Form
  const personalForm = useForm<PersonalInfoData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: user?.email || '',
      phone: '',
      countryCode: '+254',
      dateOfBirth: '',
      address: '',
      city: '',
      postalCode: '',
      country: 'Kenya',
    },
  });

  // Credit Profile Form
  const creditForm = useForm<CreditProfileData>({
    resolver: zodResolver(creditProfileSchema),
    defaultValues: {
      monthlyIncome: '',
      employmentStatus: '',
      employer: '',
      creditScore: '',
      hasExistingLoans: false,
      existingLoanAmount: '',
    },
  });

  const countryCodes = [
    { code: '+254', country: 'Kenya', flag: '🇰🇪' },
    { code: '+256', country: 'Uganda', flag: '🇺🇬' },
    { code: '+255', country: 'Tanzania', flag: '🇹🇿' },
    { code: '+250', country: 'Rwanda', flag: '🇷🇼' },
    { code: '+1', country: 'United States', flag: '🇺🇸' },
    { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
  ];

  const documentTypes = [
    {
      id: 'nationalId',
      name: 'National ID / Passport',
      description: 'Government-issued identification document',
      required: true,
      icon: <FileText className="w-4 h-4" />,
    },
    {
      id: 'proofOfIncome',
      name: 'Proof of Income',
      description: 'Salary slip, employment letter, or business registration',
      required: false,
      icon: <DollarSign className="w-4 h-4" />,
    },
    {
      id: 'bankStatement',
      name: 'Bank Statement',
      description: 'Last 3 months bank statements',
      required: false,
      icon: <CreditCard className="w-4 h-4" />,
    },
    {
      id: 'mpesaStatement',
      name: 'M-Pesa Statement',
      description: 'Last 6 months M-Pesa transaction history',
      required: false,
      icon: <Phone className="w-4 h-4" />,
    },
  ];

  const handleFileUpload = async (documentType: string, file: File) => {
    setUploadProgress(prev => ({ ...prev, [documentType]: 0 }));
    
    // Simulate file upload with progress
    const uploadSimulation = setInterval(() => {
      setUploadProgress(prev => {
        const currentProgress = prev[documentType] || 0;
        if (currentProgress >= 100) {
          clearInterval(uploadSimulation);
          setUploadedDocuments(prevDocs => ({ ...prevDocs, [documentType]: file }));
          return prev;
        }
        return { ...prev, [documentType]: currentProgress + 10 };
      });
    }, 200);
  };

  const handlePersonalInfoSubmit = async (data: PersonalInfoData) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setCurrentStep(2);
  };

  const handleCreditProfileSubmit = async (data: CreditProfileData) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setCurrentStep(3);
  };

  const handleDocumentUploadComplete = () => {
    setCurrentStep(4);
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    
    // Combine all form data
    const personalData = personalForm.getValues();
    const creditData = creditForm.getValues();
    
    const userData = {
      ...personalData,
      ...creditData,
      documents: uploadedDocuments,
      profileCompleteness: calculateProfileCompleteness(),
      onboardingCompletedAt: new Date(),
    };
    
    // Simulate final submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    onComplete(userData);
  };

  const calculateProfileCompleteness = () => {
    let completeness = 50; // Base for personal info
    
    if (creditForm.getValues().monthlyIncome) completeness += 10;
    if (creditForm.getValues().employmentStatus) completeness += 10;
    if (uploadedDocuments.nationalId) completeness += 15;
    if (uploadedDocuments.proofOfIncome) completeness += 10;
    if (uploadedDocuments.bankStatement) completeness += 5;
    
    return Math.min(completeness, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Complete Your Profile
            </h1>
            <Badge variant="outline" className="text-sm">
              Step {currentStep} of {totalSteps}
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-2">
            <span>Personal Info</span>
            <span>Financial Profile</span>
            <span>Documents</span>
            <span>Complete</span>
          </div>
        </div>

        {/* Step 1: Personal Information */}
        {currentStep === 1 && (
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5 text-blue-600" />
                <span>Personal Information</span>
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-300">
                Let's start with your basic information
              </p>
            </CardHeader>
            <CardContent>
              <Form {...personalForm}>
                <form onSubmit={personalForm.handleSubmit(handlePersonalInfoSubmit)} className="space-y-6">
                  {/* Name Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={personalForm.control}
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
                      control={personalForm.control}
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
                  </div>

                  {/* Email */}
                  <FormField
                    control={personalForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="your@email.com" 
                            {...field}
                            disabled={!!user?.email}
                          />
                        </FormControl>
                        {user?.email && (
                          <FormDescription>
                            Email pre-filled from your Google account
                          </FormDescription>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Phone Number */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={personalForm.control}
                      name="countryCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country Code</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {countryCodes.map((country) => (
                                <SelectItem key={country.code} value={country.code}>
                                  <div className="flex items-center space-x-2">
                                    <span>{country.flag}</span>
                                    <span>{country.code}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={personalForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="712 345 678" {...field} />
                          </FormControl>
                          <FormDescription>
                            Required for M-Pesa payments and notifications
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Date of Birth */}
                  <FormField
                    control={personalForm.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormDescription>
                          You must be 18 or older to use Kelo
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Address */}
                  <FormField
                    control={personalForm.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Residential Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your full address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={personalForm.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="Nairobi" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={personalForm.control}
                      name="postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postal Code</FormLabel>
                          <FormControl>
                            <Input placeholder="00100" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={personalForm.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Kenya">🇰🇪 Kenya</SelectItem>
                              <SelectItem value="Uganda">🇺🇬 Uganda</SelectItem>
                              <SelectItem value="Tanzania">🇹🇿 Tanzania</SelectItem>
                              <SelectItem value="Rwanda">🇷🇼 Rwanda</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        Continue
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Credit Profile */}
        {currentStep === 2 && (
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-green-600" />
                <span>Financial Profile</span>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Optional
                </Badge>
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-300">
                Help us understand your financial situation for better loan terms
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Benefits Banner */}
              <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>Benefits of completing your financial profile:</span>
                </h4>
                <ul className="text-sm space-y-1">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    <span>Higher credit limits (up to KES 500,000)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    <span>Lower interest rates (as low as 8% APR)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    <span>Faster approval times</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    <span>Access to premium features</span>
                  </li>
                </ul>
              </div>

              <Form {...creditForm}>
                <form onSubmit={creditForm.handleSubmit(handleCreditProfileSubmit)} className="space-y-6">
                  {/* Employment Information */}
                  <div className="space-y-4">
                    <h4 className="font-semibold">Employment Information</h4>
                    
                    <FormField
                      control={creditForm.control}
                      name="employmentStatus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Employment Status</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your employment status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="employed">Employed (Full-time)</SelectItem>
                              <SelectItem value="part-time">Employed (Part-time)</SelectItem>
                              <SelectItem value="self-employed">Self-employed</SelectItem>
                              <SelectItem value="business-owner">Business Owner</SelectItem>
                              <SelectItem value="student">Student</SelectItem>
                              <SelectItem value="unemployed">Unemployed</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={creditForm.control}
                      name="employer"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Employer / Business Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter employer or business name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={creditForm.control}
                      name="monthlyIncome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Monthly Income (KES)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="50,000" 
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Your gross monthly income before taxes
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  {/* Credit Information */}
                  <div className="space-y-4">
                    <h4 className="font-semibold">Credit Information</h4>
                    
                    <FormField
                      control={creditForm.control}
                      name="creditScore"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center space-x-2">
                            <span>Credit Score (if known)</span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Info className="w-4 h-4 text-gray-400" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Your credit score from CRB or other credit bureaus</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your credit score range" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="excellent">Excellent (750+)</SelectItem>
                              <SelectItem value="good">Good (650-749)</SelectItem>
                              <SelectItem value="fair">Fair (550-649)</SelectItem>
                              <SelectItem value="poor">Poor (300-549)</SelectItem>
                              <SelectItem value="unknown">I don't know</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={creditForm.control}
                      name="hasExistingLoans"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              I have existing loans or credit facilities
                            </FormLabel>
                            <FormDescription>
                              Including bank loans, mobile loans, or other credit facilities
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    {creditForm.watch('hasExistingLoans') && (
                      <FormField
                        control={creditForm.control}
                        name="existingLoanAmount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Total Outstanding Loan Amount (KES)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="100,000" 
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Total amount you currently owe across all loans
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>

                  <div className="flex space-x-4">
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setSkipCreditProfile(true);
                        setCurrentStep(3);
                      }}
                      className="flex-1"
                    >
                      Skip for Now
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          Continue
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Document Upload */}
        {currentStep === 3 && (
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="w-5 h-5 text-purple-600" />
                <span>Document Verification</span>
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-300">
                Upload documents to verify your identity and improve your credit profile
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Security Notice */}
              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800 dark:text-blue-200">
                    <p className="font-medium mb-1">Your documents are secure</p>
                    <p>All documents are encrypted and stored securely. We comply with data protection regulations and only use your documents for verification purposes.</p>
                  </div>
                </div>
              </div>

              {/* Document Upload Cards */}
              <div className="space-y-4">
                {documentTypes.map((docType) => (
                  <div key={docType.id} className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:border-purple-300 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                          {docType.icon}
                        </div>
                        <div>
                          <h4 className="font-semibold flex items-center space-x-2">
                            <span>{docType.name}</span>
                            {docType.required && (
                              <Badge variant="destructive" className="text-xs">Required</Badge>
                            )}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {docType.description}
                          </p>
                        </div>
                      </div>
                      
                      {uploadedDocuments[docType.id] ? (
                        <div className="flex items-center space-x-2 text-green-600">
                          <CheckCircle className="w-5 h-5" />
                          <span className="text-sm font-medium">Uploaded</span>
                        </div>
                      ) : uploadProgress[docType.id] !== undefined ? (
                        <div className="flex items-center space-x-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-sm">{uploadProgress[docType.id]}%</span>
                        </div>
                      ) : null}
                    </div>

                    {!uploadedDocuments[docType.id] && uploadProgress[docType.id] === undefined && (
                      <div>
                        <input
                          type="file"
                          id={`upload-${docType.id}`}
                          className="hidden"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleFileUpload(docType.id, file);
                            }
                          }}
                        />
                        <label
                          htmlFor={`upload-${docType.id}`}
                          className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer transition-colors"
                        >
                          <Upload className="w-4 h-4" />
                          <span>Choose File</span>
                        </label>
                        <p className="text-xs text-gray-500 mt-2">
                          Supported formats: PDF, JPG, PNG (max 5MB)
                        </p>
                      </div>
                    )}

                    {uploadProgress[docType.id] !== undefined && uploadProgress[docType.id] < 100 && (
                      <div className="mt-4">
                        <Progress value={uploadProgress[docType.id]} className="h-2" />
                      </div>
                    )}

                    {uploadedDocuments[docType.id] && (
                      <div className="mt-4 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-green-800 dark:text-green-200">
                            {uploadedDocuments[docType.id].name}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setUploadedDocuments(prev => {
                                const newDocs = { ...prev };
                                delete newDocs[docType.id];
                                return newDocs;
                              });
                            }}
                            className="text-red-600 hover:text-red-700"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Skip Option */}
              <div className="p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div className="text-sm text-yellow-800 dark:text-yellow-200">
                    <p className="font-medium mb-1">You can skip document upload</p>
                    <p>You'll start with a basic credit limit and can upload documents later to increase your limits and get better rates.</p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(2)}
                  className="flex-1"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button 
                  type="button"
                  variant="outline"
                  onClick={handleDocumentUploadComplete}
                  className="flex-1"
                >
                  Skip Documents
                </Button>
                <Button 
                  onClick={handleDocumentUploadComplete}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                  disabled={!uploadedDocuments.nationalId}
                >
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Completion */}
        {currentStep === 4 && (
          <Card className="border-0 shadow-xl">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Profile Complete!</CardTitle>
              <p className="text-gray-600 dark:text-gray-300">
                Your Kelo account is ready to use
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Completeness */}
              <div className="p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold">Profile Completeness</h4>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    {calculateProfileCompleteness()}%
                  </Badge>
                </div>
                <Progress value={calculateProfileCompleteness()} className="h-3 mb-4" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Personal information</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!skipCreditProfile ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-yellow-600" />
                      )}
                      <span>Financial profile</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      {uploadedDocuments.nationalId ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-yellow-600" />
                      )}
                      <span>Identity verification</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {Object.keys(uploadedDocuments).length > 1 ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-yellow-600" />
                      )}
                      <span>Supporting documents</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Credit Limit Preview */}
              <div className="p-6 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <h4 className="font-semibold mb-4 flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-blue-600" />
                  <span>Your Initial Credit Limit</span>
                </h4>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    KES {(calculateProfileCompleteness() * 1000).toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Available for immediate use
                  </p>
                </div>
              </div>

              {/* Next Steps */}
              <div className="space-y-3">
                <h4 className="font-semibold">What's next?</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Start shopping with instant approval</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Complete remaining documents to increase limits</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Build your credit score with on-time payments</span>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleFinalSubmit}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Setting up your account...
                  </>
                ) : (
                  <>
                    Start Shopping
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}