import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | SunShare',
    default: 'Join SunShare',
  },
};

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Clean layout without header/footer for focused onboarding experience
  return (
    <div className="min-h-screen bg-sunshare-cream">
      {children}
    </div>
  );
}
