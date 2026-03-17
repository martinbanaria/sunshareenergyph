import type { Metadata } from 'next';
import CIOnboardingDemo from '@/components/onboarding/CIOnboardingDemo';

export const metadata: Metadata = {
  title: 'C&I Onboarding Demo',
  robots: { index: false, follow: false },
};

export default function CIDemoPage() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#00242E',
      color: '#F3F6E4',
      paddingTop: '1rem',
      paddingBottom: '3rem',
    }}>
      <CIOnboardingDemo />
    </div>
  );
}
