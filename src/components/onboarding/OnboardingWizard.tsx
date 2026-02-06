'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OnboardingFormData, INITIAL_ONBOARDING_DATA, Step1Data, Step2Data, Step3Data, Step4Data, Step5Data } from '@/types/onboarding';
import { submitOnboardingData } from '@/lib/api/onboarding';
import { StepIndicator } from './StepIndicator';
import { Step1Account } from './steps/Step1Account';
import { Step2IDUpload } from './steps/Step2IDUpload';
import { Step3Property } from './steps/Step3Property';
import { Step4Preferences } from './steps/Step4Preferences';
import { Step5Review } from './steps/Step5Review';

const STORAGE_KEY = 'sunshare_onboarding';
const IMAGE_STORAGE_KEY = 'sunshare_onboarding_image';
const TOTAL_STEPS = 5;

// Fields to exclude from localStorage for security/size reasons
const SENSITIVE_FIELDS = ['password', 'confirmPassword', 'captchaToken'];

// Helper to sanitize data before storing in localStorage
function sanitizeForStorage(data: OnboardingFormData): OnboardingFormData {
  return {
    ...data,
    step1: {
      ...data.step1,
      password: '',
      confirmPassword: '',
      captchaToken: '',
    },
    step2: {
      ...data.step2,
      idImage: '', // Store separately or skip - too large for localStorage
    },
  };
}

// Helper to safely store image (with size check)
function tryStoreImage(image: string): boolean {
  if (!image) return true;
  
  // Check if image is too large (> 2MB base64 = ~1.5MB actual)
  if (image.length > 2 * 1024 * 1024) {
    console.warn('ID image too large for localStorage, skipping persistence');
    return false;
  }
  
  try {
    sessionStorage.setItem(IMAGE_STORAGE_KEY, image);
    return true;
  } catch (e) {
    console.warn('Failed to store image in sessionStorage:', e);
    return false;
  }
}

// Helper to retrieve stored image
function getStoredImage(): string {
  try {
    return sessionStorage.getItem(IMAGE_STORAGE_KEY) || '';
  } catch {
    return '';
  }
}

const STEP_TITLES = [
  'Create Account',
  'Upload ID',
  'Property Details',
  'Preferences',
  'Review & Submit',
];

export function OnboardingWizard() {
  const [formData, setFormData] = useState<OnboardingFormData>(INITIAL_ONBOARDING_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Load saved progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as OnboardingFormData;
        // Restore image from sessionStorage if available
        const storedImage = getStoredImage();
        if (storedImage) {
          parsed.step2.idImage = storedImage;
        }
        setFormData(parsed);
      } catch {
        // Invalid data, start fresh
      }
    }
    setIsLoading(false);
  }, []);

  // Save progress to localStorage (sanitized - no passwords or large images)
  useEffect(() => {
    if (!isLoading) {
      try {
        const sanitized = sanitizeForStorage(formData);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
        // Store image separately in sessionStorage (size-limited)
        if (formData.step2.idImage) {
          tryStoreImage(formData.step2.idImage);
        }
      } catch (e) {
        console.warn('Failed to save progress to localStorage:', e);
      }
    }
  }, [formData, isLoading]);

  const updateStep1 = (data: Partial<Step1Data>) => {
    setFormData((prev) => ({
      ...prev,
      step1: { ...prev.step1, ...data },
    }));
  };

  const updateStep2 = (data: Partial<Step2Data>) => {
    setFormData((prev) => ({
      ...prev,
      step2: { ...prev.step2, ...data },
    }));
  };

  const updateStep3 = (data: Partial<Step3Data>) => {
    setFormData((prev) => ({
      ...prev,
      step3: { ...prev.step3, ...data },
    }));
  };

  const updateStep4 = (data: Partial<Step4Data>) => {
    setFormData((prev) => ({
      ...prev,
      step4: { ...prev.step4, ...data },
    }));
  };

  const updateStep5 = (data: Partial<Step5Data>) => {
    setFormData((prev) => ({
      ...prev,
      step5: { ...prev.step5, ...data },
    }));
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= TOTAL_STEPS) {
      setFormData((prev) => ({ ...prev, currentStep: step }));
    }
  };

  const nextStep = () => {
    if (formData.currentStep < TOTAL_STEPS) {
      setFormData((prev) => ({
        ...prev,
        currentStep: prev.currentStep + 1,
        completedSteps: prev.completedSteps.includes(prev.currentStep)
          ? prev.completedSteps
          : [...prev.completedSteps, prev.currentStep],
      }));
    }
  };

  const prevStep = () => {
    if (formData.currentStep > 1) {
      goToStep(formData.currentStep - 1);
    }
  };

  const clearProgress = () => {
    localStorage.removeItem(STORAGE_KEY);
    try {
      sessionStorage.removeItem(IMAGE_STORAGE_KEY);
    } catch {
      // Ignore sessionStorage errors
    }
    setFormData(INITIAL_ONBOARDING_DATA);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await submitOnboardingData(formData);

      if (result.success) {
        // Clear progress after successful submission
        clearProgress();
        // Redirect to success page
        window.location.href = '/onboarding/success';
      } else {
        setSubmitError(result.error || 'Submission failed. Please try again.');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitError('An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sunshare-cream">
        <div className="animate-pulse text-sunshare-navy">Loading...</div>
      </div>
    );
  }

  const renderStep = () => {
    switch (formData.currentStep) {
      case 1:
        return (
          <Step1Account
            data={formData.step1}
            onUpdate={updateStep1}
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <Step2IDUpload
            data={formData.step2}
            onUpdate={updateStep2}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 3:
        return (
          <Step3Property
            data={formData.step3}
            extractedAddress={formData.step2.extractedAddress}
            onUpdate={updateStep3}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 4:
        return (
          <Step4Preferences
            data={formData.step4}
            onUpdate={updateStep4}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 5:
        return (
          <Step5Review
            formData={formData}
            onUpdate={updateStep5}
            onSubmit={handleSubmit}
            onBack={prevStep}
            onEditStep={goToStep}
            isSubmitting={isSubmitting}
            submitError={submitError}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sunshare-cream to-white py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-sunshare-deep mb-2">
            Join SunShare
          </h1>
          <p className="text-sunshare-gray">
            {STEP_TITLES[formData.currentStep - 1]}
          </p>
        </div>

        {/* Step Indicator */}
        <StepIndicator
          currentStep={formData.currentStep}
          totalSteps={TOTAL_STEPS}
          completedSteps={formData.completedSteps}
          stepTitles={STEP_TITLES}
        />

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={formData.currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="mt-8"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        {/* Save & Continue Later */}
        {formData.currentStep < TOTAL_STEPS && (
          <div className="mt-6 text-center">
            <p className="text-sm text-sunshare-gray">
              Your progress is automatically saved.{' '}
              <button
                onClick={clearProgress}
                className="text-sunshare-navy underline hover:no-underline"
              >
                Start over
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
