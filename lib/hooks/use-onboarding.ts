'use client';

import { useState, useCallback } from 'react';
import { onboardingService, type OnboardingData, type OnboardingResult } from '@/lib/services/onboarding-service';

export interface OnboardingHook {
  isSubmitting: boolean;
  error: string | null;
  submitOnboarding: (data: OnboardingData) => Promise<OnboardingResult>;
  clearError: () => void;
}

export function useOnboarding(): OnboardingHook {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitOnboarding = useCallback(async (data: OnboardingData): Promise<OnboardingResult> => {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await onboardingService.submitOnboarding(data);
      
      if (!result.success) {
        setError(result.error || 'Failed to complete onboarding');
      }

      return result;
    } catch (err) {
      const errorMessage = 'An unexpected error occurred during onboarding';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isSubmitting,
    error,
    submitOnboarding,
    clearError,
  };
}