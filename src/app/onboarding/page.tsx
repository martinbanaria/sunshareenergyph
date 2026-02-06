import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Join SunShare | Start Your Solar Journey',
  description: 'Create your SunShare account and start saving with clean, renewable solar energy in the Philippines.',
};

export default function OnboardingPage() {
  return <OnboardingWizard />;
}
