'use client';
import React from 'react';
import CIOnboardingDemo from '@/components/onboarding/CIOnboardingDemo';
import { useOnboardingTheme } from '@/components/onboarding/useOnboardingTheme';

export default function CIDemoPage() {
  const { pageBackground, textColor } = useOnboardingTheme();

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: pageBackground,
      color: textColor,
      paddingTop: '1rem',
      paddingBottom: '3rem',
    }}>
      <CIOnboardingDemo />
    </div>
  );
}
