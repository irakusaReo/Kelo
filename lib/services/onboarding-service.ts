import { z } from 'zod';

export interface OnboardingData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    countryCode: string;
    dateOfBirth: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  creditProfile?: {
    monthlyIncome?: string;
    employmentStatus?: string;
    employer?: string;
    creditScore?: string;
    hasExistingLoans?: boolean;
    existingLoanAmount?: string;
  };
  documents: Record<string, File>;
  profileCompleteness: number;
  onboardingCompletedAt: Date;
}

export interface OnboardingResult {
  success: boolean;
  userId?: string;
  creditLimit?: number;
  error?: string;
}

class OnboardingService {
  /**
   * Submit complete onboarding data
   */
  async submitOnboarding(data: OnboardingData): Promise<OnboardingResult> {
    try {
      // Validate data
      const validationResult = this.validateOnboardingData(data);
      if (!validationResult.isValid) {
        return {
          success: false,
          error: validationResult.error,
        };
      }

      // Upload documents securely
      const documentUrls = await this.uploadDocuments(data.documents);

      // Calculate initial credit limit
      const creditLimit = this.calculateInitialCreditLimit(data);

      // Save user profile
      const userId = await this.saveUserProfile({
        ...data,
        documentUrls,
        creditLimit,
      });

      // Send welcome email
      await this.sendWelcomeEmail(data.personalInfo.email, {
        name: `${data.personalInfo.firstName} ${data.personalInfo.lastName}`,
        creditLimit,
        profileCompleteness: data.profileCompleteness,
      });

      // Create audit log
      await this.createAuditLog(userId, 'onboarding_completed', {
        profileCompleteness: data.profileCompleteness,
        documentsUploaded: Object.keys(data.documents),
        creditLimit,
      });

      return {
        success: true,
        userId,
        creditLimit,
      };
    } catch (error) {
      console.error('Error submitting onboarding:', error);
      return {
        success: false,
        error: 'Failed to complete onboarding. Please try again.',
      };
    }
  }

  /**
   * Validate onboarding data
   */
  private validateOnboardingData(data: OnboardingData): { isValid: boolean; error?: string } {
    try {
      // Validate personal information
      const personalInfoSchema = z.object({
        firstName: z.string().min(2),
        lastName: z.string().min(2),
        email: z.string().email(),
        phone: z.string().min(10),
        dateOfBirth: z.string(),
        address: z.string().min(10),
        city: z.string().min(2),
        postalCode: z.string().min(4),
        country: z.string().min(1),
      });

      personalInfoSchema.parse(data.personalInfo);

      // Validate age requirement (18+)
      const birthDate = new Date(data.personalInfo.dateOfBirth);
      const age = new Date().getFullYear() - birthDate.getFullYear();
      if (age < 18) {
        return {
          isValid: false,
          error: 'You must be 18 or older to use Kelo',
        };
      }

      // Validate required documents
      if (!data.documents.nationalId) {
        return {
          isValid: false,
          error: 'National ID or Passport is required',
        };
      }

      return { isValid: true };
    } catch (error) {
      return {
        isValid: false,
        error: 'Invalid data provided',
      };
    }
  }

  /**
   * Upload documents securely
   */
  private async uploadDocuments(documents: Record<string, File>): Promise<Record<string, string>> {
    const uploadPromises = Object.entries(documents).map(async ([type, file]) => {
      // In production, upload to secure cloud storage (AWS S3, Google Cloud Storage, etc.)
      const uploadUrl = await this.uploadToSecureStorage(file, type);
      return [type, uploadUrl];
    });

    const uploadResults = await Promise.all(uploadPromises);
    return Object.fromEntries(uploadResults);
  }

  /**
   * Upload file to secure storage
   */
  private async uploadToSecureStorage(file: File, documentType: string): Promise<string> {
    // Simulate secure file upload
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In production, this would:
    // 1. Encrypt the file
    // 2. Upload to secure storage
    // 3. Return the secure URL
    // 4. Log the upload for audit purposes
    
    return `https://secure-storage.kelo.finance/documents/${documentType}/${Date.now()}-${file.name}`;
  }

  /**
   * Calculate initial credit limit based on profile completeness
   */
  private calculateInitialCreditLimit(data: OnboardingData): number {
    let baseLimit = 10000; // Base limit of KES 10,000

    // Increase based on profile completeness
    if (data.profileCompleteness >= 80) {
      baseLimit *= 5; // KES 50,000
    } else if (data.profileCompleteness >= 60) {
      baseLimit *= 3; // KES 30,000
    } else if (data.profileCompleteness >= 40) {
      baseLimit *= 2; // KES 20,000
    }

    // Additional factors
    if (data.creditProfile?.monthlyIncome) {
      const income = parseInt(data.creditProfile.monthlyIncome);
      if (income > 100000) {
        baseLimit *= 1.5;
      } else if (income > 50000) {
        baseLimit *= 1.2;
      }
    }

    if (data.creditProfile?.creditScore === 'excellent') {
      baseLimit *= 1.5;
    } else if (data.creditProfile?.creditScore === 'good') {
      baseLimit *= 1.2;
    }

    // Cap at reasonable maximum for new users
    return Math.min(baseLimit, 200000);
  }

  /**
   * Save user profile to database
   */
  private async saveUserProfile(data: OnboardingData & { documentUrls: Record<string, string>; creditLimit: number }): Promise<string> {
    // In production, save to secure database
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Simulate database save
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('User profile saved:', {
      userId,
      email: data.personalInfo.email,
      creditLimit: data.creditLimit,
      profileCompleteness: data.profileCompleteness,
    });

    return userId;
  }

  /**
   * Send welcome email
   */
  private async sendWelcomeEmail(email: string, data: { name: string; creditLimit: number; profileCompleteness: number }): Promise<void> {
    // In production, integrate with email service (SendGrid, AWS SES, etc.)
    console.log('Welcome email sent to:', email, data);
    
    // Email would include:
    // - Welcome message
    // - Credit limit information
    // - Next steps
    // - Profile completion status
    // - Security tips
  }

  /**
   * Create audit log
   */
  private async createAuditLog(userId: string, action: string, metadata: any): Promise<void> {
    // In production, log to secure audit system
    console.log('Audit log created:', {
      userId,
      action,
      metadata,
      timestamp: new Date(),
      ip: 'user-ip-address',
      userAgent: 'user-agent-string',
    });
  }

  /**
   * Get onboarding status
   */
  async getOnboardingStatus(userId: string): Promise<{
    isComplete: boolean;
    currentStep: number;
    profileCompleteness: number;
    missingDocuments: string[];
  }> {
    // In production, fetch from database
    return {
      isComplete: false,
      currentStep: 1,
      profileCompleteness: 0,
      missingDocuments: ['nationalId'],
    };
  }

  /**
   * Update onboarding step
   */
  async updateOnboardingStep(userId: string, step: number, data: any): Promise<boolean> {
    try {
      // In production, update database
      console.log('Onboarding step updated:', { userId, step, data });
      return true;
    } catch (error) {
      console.error('Error updating onboarding step:', error);
      return false;
    }
  }
}

export const onboardingService = new OnboardingService();