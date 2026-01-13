'use client';

import { Section, SectionHeader } from '@/components/ui/Section';
import { ServiceCard } from '@/components/ui/Card';
import { Zap, Sun, Battery, BarChart3 } from 'lucide-react';

const solutions = [
  {
    icon: Zap,
    title: 'Lower Electricity Cost Today',
    description: 'Start saving right away by switching to SunShare, then grow into solar and battery solutions at your pace with guided onboarding and financing.',
  },
  {
    icon: Sun,
    title: 'Solar Made Simple',
    description: 'After switching, SunShare helps map your rooftop, match you with accredited solar installers, and give you access to solar bundles and financing options.',
  },
  {
    icon: Battery,
    title: 'Future-Ready with Battery Storage',
    description: 'Once your solar is running, SunShare supports you in adding battery storage for reliability, outage protection, and optimized energy use.',
  },
  {
    icon: BarChart3,
    title: 'Smarter Energy Management',
    description: 'Track usage, monitor savings, view your solar performance, and manage your SunShare bundles all in one digital dashboard.',
  },
];

export function Solutions() {
  return (
    <Section id="how-we-can-help" background="gradient">
      <SectionHeader
        kicker="How We Can Help"
        title="Empowering Your Community Through Smarter, Cheaper, and Cleaner Energy"
        subtitle="Start with lower electricity costs today, then unlock solar and battery savings with guided bundles and financing at every step."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {solutions.map((solution) => (
          <ServiceCard
            key={solution.title}
            icon={solution.icon}
            title={solution.title}
            description={solution.description}
          />
        ))}
      </div>
    </Section>
  );
}

export default Solutions;
