'use client';

import { Section, SectionHeader } from '@/components/ui/Section';
import { StepCard } from '@/components/ui/Card';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

const steps = [
  {
    step: 1,
    title: 'Join Us to Assess Your Eligibility',
    description: "We'll review your energy demand and confirm you meet ERC requirements so you can choose your supplier with confidence.",
  },
  {
    step: 2,
    title: 'Organize and Facilitate Your Application',
    description: "We'll handle all the details and guide you through a smooth, hassle-free application process.",
  },
  {
    step: 3,
    title: 'Enjoy Lower, Predictable Monthly Bills',
    description: 'Make the switch and start saving with better rates and more consistent, reliable monthly costs.',
  },
];

const benefits = [
  'Empower users to choose',
  'Boost competition',
  'Ensure fair switching and billing',
  'Protect consumer rights',
  'Embrace new energy technologies',
];

export function HowItWorks() {
  return (
    <Section id="how-it-works">
      <SectionHeader
        kicker="How It Works"
        title="Take Control of Your Electricity, the Easy Way"
        subtitle="Filipinos now have the power to choose where their electricity comes from. SunShare makes that choice easy, transparent, and fair."
      />

      {/* Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
        {steps.map((step, index) => (
          <motion.div
            key={step.step}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <StepCard
              step={step.step}
              title={step.title}
              description={step.description}
              className="h-full"
            />
          </motion.div>
        ))}
      </div>

      {/* Benefits */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="card p-6 md:p-8"
      >
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {benefits.map((benefit) => (
            <div key={benefit} className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-sunshare-lime/20 flex items-center justify-center">
                <Check className="w-3 h-3 text-sunshare-lime" />
              </div>
              <span className="text-white/80 text-sm">{benefit}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </Section>
  );
}

export default HowItWorks;
