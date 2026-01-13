'use client';

import { motion } from 'framer-motion';
import { Section, SectionHeader } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Zap, Sun, Battery, BarChart3, Check, TrendingDown, Shield } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 }
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
    savingsLabel: 'Potential Savings',
    savingsSubtext: 'on energy costs',
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
    savingsLabel: 'Potential Savings',
    savingsSubtext: 'on energy costs',
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
    savingsLabel: 'Potential Savings',
    savingsSubtext: 'on energy costs',
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
    savings: 'Full Insight',
    savingsLabel: 'Key Benefit',
    savingsSubtext: 'into your energy use',
  },
];

const journey = [
  {
    phase: 'Phase 1',
    title: 'Save Now',
    description: 'Start with RES aggregation for immediate 7-12% savings',
    icon: TrendingDown,
  },
  {
    phase: 'Phase 2',
    title: 'Save More',
    description: 'Add subscription solar for approximately 30% savings',
    icon: Sun,
  },
  {
    phase: 'Phase 3',
    title: 'Never Worry',
    description: 'Complete with Solar + BESS for up to 82% savings',
    icon: Shield,
  },
];

const segments = [
  { title: 'Households', description: 'Lower your monthly bills and gain energy independence' },
  { title: 'HOAs & Condos', description: 'Aggregate demand across your community for better rates' },
  { title: 'SMEs', description: 'Reduce operating costs with predictable energy pricing' },
  { title: 'Large Facilities', description: 'Custom solutions for maximum savings and reliability' },
];

export default function SolutionsPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden bg-grid-pattern">
        <div className="absolute inset-0 bg-gradient-to-b from-sunshare-deep via-sunshare-deep to-sunshare-navy/30" />
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-sunshare-lime/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-radiant-teal/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl relative z-10 py-24 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <motion.p {...fadeInUp} className="kicker mb-4">
              Our Solutions
            </motion.p>
            <motion.h1 
              {...fadeInUp}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="h1 text-white mb-6"
            >
              Empowering Your Community Through{' '}
              <span className="text-gradient">Smarter Energy</span>
            </motion.h1>
            <motion.p 
              {...fadeInUp}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="body-large max-w-2xl mx-auto"
            >
              Start with lower electricity costs today, then unlock solar and battery 
              savings with guided bundles and financing at every step.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Customer Journey - Compact horizontal timeline */}
      <Section spacing="compact">
        <motion.div {...fadeInUp} className="text-center mb-10">
          <p className="kicker mb-3">Your Energy Journey</p>
          <h2 className="h2 text-white">Three Phases to Energy Independence</h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          {journey.map((phase, index) => (
            <motion.div
              key={phase.phase}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="p-5 relative h-full border-sunshare-lime/20">
                {/* Connector line */}
                {index < journey.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 lg:-right-3 w-6 h-px bg-gradient-to-r from-sunshare-lime/40 to-transparent" />
                )}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-sunshare-lime/10 flex items-center justify-center flex-shrink-0">
                    <phase.icon className="w-5 h-5 text-sunshare-lime" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-sunshare-lime mb-0.5">{phase.phase}</p>
                    <h3 className="font-semibold text-white mb-1">{phase.title}</h3>
                    <p className="body-text text-sm">{phase.description}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Solutions Detail - Alternating layout */}
      <Section background="gradient" spacing="compact">
        <motion.div {...fadeInUp} className="text-center mb-10">
          <p className="kicker mb-2">How We Can Help</p>
          <h2 className="h2 text-white">Comprehensive Energy Solutions</h2>
        </motion.div>
        
        <div className="space-y-8 lg:space-y-10">
          {solutions.map((solution, index) => (
            <motion.div
              key={solution.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="p-6 md:p-8">
                <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center ${
                  index % 2 === 1 ? 'lg:[direction:rtl]' : ''
                }`}>
                  {/* Content */}
                  <div className={`lg:col-span-8 ${index % 2 === 1 ? 'lg:[direction:ltr]' : ''}`}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-11 h-11 rounded-xl bg-sunshare-lime/10 flex items-center justify-center">
                        <solution.icon className="w-5 h-5 text-sunshare-lime" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-lg">{solution.title}</h3>
                        <p className="text-sm text-white/60">{solution.subtitle}</p>
                      </div>
                    </div>
                    <p className="body-text mb-5">{solution.description}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {solution.benefits.map((benefit) => (
                        <div key={benefit} className="flex items-start gap-2">
                          <div className="w-4 h-4 rounded-full bg-sunshare-lime/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check className="w-2.5 h-2.5 text-sunshare-lime" />
                          </div>
                          <span className="text-sm text-white/80">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Savings badge */}
                  <div className={`lg:col-span-4 ${index % 2 === 1 ? 'lg:[direction:ltr]' : ''}`}>
                    <div className="bg-sunshare-deep/50 rounded-xl p-6 text-center">
                      <p className="text-xs uppercase tracking-wider text-white/60 mb-1">{solution.savingsLabel}</p>
                      <p className="text-4xl md:text-5xl font-semibold text-sunshare-lime">{solution.savings}</p>
                      <p className="text-sm text-white/60 mt-1">{solution.savingsSubtext}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Who We Serve */}
      <Section spacing="compact">
        <motion.div {...fadeInUp} className="text-center mb-8">
          <p className="kicker mb-2">Who We Serve</p>
          <h2 className="h2 text-white mb-3">Solutions for Every Segment</h2>
          <p className="body-text max-w-2xl mx-auto">
            Whether you&apos;re a homeowner, HOA, SME, or large facility, SunShare has a solution tailored to your needs.
          </p>
        </motion.div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {segments.map((segment, index) => (
            <motion.div
              key={segment.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="p-5 text-center h-full">
                <h4 className="font-semibold text-white mb-2">{segment.title}</h4>
                <p className="body-text text-sm">{segment.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section spacing="tight" className="pb-16 md:pb-20 pt-0">
        <motion.div {...fadeInUp}>
          <Card className="p-8 md:p-10 text-center bg-gradient-to-br from-sunshare-navy/50 to-sunshare-deep/50">
            <h2 className="h2 text-white mb-3">
              Find the Right Solution for You
            </h2>
            <p className="body-large max-w-2xl mx-auto mb-6">
              Get a free assessment to discover how much you could save with SunShare&apos;s 
              energy solutions.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button href="https://studio--sunshare-registration-portal.us-central1.hosted.app/signup-member" external comingSoon>
                Get a Free Assessment
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button href="/contact" variant="secondary">
                Contact Us
              </Button>
            </div>
          </Card>
        </motion.div>
      </Section>
    </>
  );
}
