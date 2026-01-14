'use client';

import { Section, SectionHeader } from '@/components/ui/Section';
import { StepCard } from '@/components/ui/Card';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
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
    <Section id="how-it-works" theme="light">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start mb-12">
        {/* Image Column */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <OptimizedImage
            src="/images/sections/how-it-works-consultation.jpg"
            alt="SunShare energy consultant helping Filipino customer with assessment"
            aspectRatio="4/3"
            overlay="gradient"
            className="rounded-xl shadow-lg"
          />
        </motion.div>

        {/* Content Column */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <p className="text-sunshare-navy text-xs sm:text-sm font-medium tracking-[0.2em] uppercase mb-4">How It Works</p>
          <h2 className="h2 text-sunshare-deep mb-6">
            Take Control of Your Electricity, the Easy Way
          </h2>
          <p className="text-sunshare-gray mb-8">
            Filipinos now have the power to choose where their electricity comes from. SunShare makes that choice easy, transparent, and fair.
          </p>
          
          {/* Benefits grid */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-sunshare-navy/10 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-sunshare-navy" />
                </div>
                <span className="text-sunshare-gray text-sm">{benefit}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
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
              theme="light"
              className="h-full"
            />
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

export default HowItWorks;
