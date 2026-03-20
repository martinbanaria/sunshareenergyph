'use client';
import React, { useEffect } from 'react';
import OnboardingWizard from '@/components/onboarding/OnboardingWizard';
import { useOnboardingTheme } from '@/components/onboarding/useOnboardingTheme';

const OnboardingPage = () => {
  const { pageBackground, textColor } = useOnboardingTheme();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  return (
    <div style={{
      padding: '1rem',
      minHeight: '100vh',
      backgroundColor: pageBackground,
      color: textColor,
    }}>
      <OnboardingWizard />
    </div>
  );
};

export default OnboardingPage;
