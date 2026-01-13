import { Metadata } from 'next';
import { Section, SectionHeader } from '@/components/ui/Section';
import { Card, ServiceCard } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Zap, Sun, Battery, BarChart3, Check, TrendingDown, Shield, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Our Solutions',
  description: 'Discover SunShare\'s comprehensive energy solutions: demand aggregation, rooftop solar, battery storage, and smart energy management.',
};

const solutions = [
  {
    icon: Zap,
    title: 'Lower Electricity Cost Today',
    subtitle: 'Immediate Savings Through Aggregation',
    description: 'Start saving right away by switching to SunShare. Through demand aggregation, we pool energy needs from multiple consumers to negotiate better rates from electricity suppliers.',
    benefits: [
      '7-12% immediate savings on electricity bills',
      'No upfront investment required',
      'Simple switching process',
      'Continue using your existing connection',
    ],
    savings: '7-12%',
  },
  {
    icon: Sun,
    title: 'Solar Made Simple',
    subtitle: 'Rooftop Solar Solutions',
    description: 'After switching, SunShare helps map your rooftop, match you with accredited solar installers, and give you access to solar bundles and financing options.',
    benefits: [
      'Up to 30% additional savings',
      'Zero or low upfront cost options',
      'Accredited installation partners',
      'Subscription and financing available',
    ],
    savings: '~30%',
  },
  {
    icon: Battery,
    title: 'Future-Ready with Battery Storage',
    subtitle: 'Battery Energy Storage Systems (BESS)',
    description: 'Once your solar is running, SunShare supports you in adding battery storage for reliability, outage protection, and optimized energy use.',
    benefits: [
      'Up to 82% total energy savings',
      'Protection during power outages',
      'Energy independence',
      'Optimized self-consumption',
    ],
    savings: '~82%',
  },
  {
    icon: BarChart3,
    title: 'Smarter Energy Management',
    subtitle: 'Digital Monitoring & Optimization',
    description: 'Track usage, monitor savings, view your solar performance, and manage your SunShare bundles all in one digital dashboard.',
    benefits: [
      'Real-time energy monitoring',
      'Savings tracking and analytics',
      'Solar performance visibility',
      'Easy bundle management',
    ],
    savings: 'Visibility',
  },
];

const journey = [
  {
    phase: 'Phase 1',
    title: 'Save Now',
    description: 'Start with RES aggregation for immediate 7-12% savings',
    icon: TrendingDown,
    color: 'sunshare-lime',
  },
  {
    phase: 'Phase 2',
    title: 'Save More',
    description: 'Add subscription solar for approximately 30% savings',
    icon: Sun,
    color: 'sunshare-lime',
  },
  {
    phase: 'Phase 3',
    title: 'Never Worry',
    description: 'Complete with Solar + BESS for up to 82% savings and energy autonomy',
    icon: Shield,
    color: 'radiant-teal',
  },
];

export default function SolutionsPage() {
  return (
    <>
      {/* Hero Section */}
      <Section className="pt-24 md:pt-32">
        <div className="max-w-4xl mx-auto text-center">
          <p className="kicker mb-4">Our Solutions</p>
          <h1 className="h1 text-white mb-6">
            Empowering Your Community Through{' '}
            <span className="text-gradient">Smarter Energy</span>
          </h1>
          <p className="body-large">
            Start with lower electricity costs today, then unlock solar and battery 
            savings with guided bundles and financing at every step.
          </p>
        </div>
      </Section>

      {/* Customer Journey */}
      <Section background="gradient">
        <SectionHeader
          kicker="Your Energy Journey"
          title="Three Phases to Energy Independence"
          subtitle="SunShare guides you through a progressive journey toward maximum savings and energy autonomy."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {journey.map((phase, index) => (
            <Card key={phase.phase} className="p-6 relative">
              {index < journey.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-white/20" />
              )}
              <div className={`w-12 h-12 rounded-xl bg-${phase.color}/10 flex items-center justify-center mb-4`}>
                <phase.icon className={`w-6 h-6 text-${phase.color}`} />
              </div>
              <p className="text-sm font-medium text-sunshare-lime mb-1">{phase.phase}</p>
              <h3 className="h3 text-white mb-3">{phase.title}</h3>
              <p className="body-text">{phase.description}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* Solutions Detail */}
      <Section>
        <SectionHeader
          kicker="How We Can Help"
          title="Comprehensive Energy Solutions"
        />
        <div className="space-y-12 lg:space-y-16">
          {solutions.map((solution, index) => (
            <div 
              key={solution.title}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-sunshare-lime/10 flex items-center justify-center">
                    <solution.icon className="w-6 h-6 text-sunshare-lime" />
                  </div>
                  <div>
                    <h3 className="h3 text-white">{solution.title}</h3>
                    <p className="text-sm text-white/60">{solution.subtitle}</p>
                  </div>
                </div>
                <p className="body-text mb-6">{solution.description}</p>
                <div className="space-y-3 mb-6">
                  {solution.benefits.map((benefit) => (
                    <div key={benefit} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-sunshare-lime/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-sunshare-lime" />
                      </div>
                      <span className="text-white/80">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Card className={`p-8 text-center ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                <p className="kicker mb-2">Potential Savings</p>
                <p className="metric text-sunshare-lime">{solution.savings}</p>
                <p className="body-text mt-2">on your energy costs</p>
              </Card>
            </div>
          ))}
        </div>
      </Section>

      {/* For Different Segments */}
      <Section background="gradient">
        <SectionHeader
          kicker="Who We Serve"
          title="Solutions for Every Segment"
          subtitle="Whether you're a homeowner, HOA, SME, or large facility, SunShare has a solution tailored to your needs."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Households', description: 'Lower your monthly bills and gain energy independence' },
            { title: 'HOAs & Condos', description: 'Aggregate demand across your community for better rates' },
            { title: 'SMEs', description: 'Reduce operating costs with predictable energy pricing' },
            { title: 'Large Facilities', description: 'Custom solutions for maximum savings and reliability' },
          ].map((segment) => (
            <Card key={segment.title} className="p-6 text-center">
              <h4 className="font-semibold text-white mb-2">{segment.title}</h4>
              <p className="body-text text-sm">{segment.description}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <Card className="p-8 md:p-12 text-center">
          <h2 className="h2 text-white mb-4">
            Find the Right Solution for You
          </h2>
          <p className="body-large max-w-2xl mx-auto mb-8">
            Get a free assessment to discover how much you could save with SunShare&apos;s 
            energy solutions.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button href="https://studio--sunshare-registration-portal.us-central1.hosted.app/signup-member" external>
              Get a Free Assessment
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button href="/contact" variant="secondary">
              Contact Us
            </Button>
          </div>
        </Card>
      </Section>
    </>
  );
}
