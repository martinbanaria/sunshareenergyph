'use client';

import { Section, SectionHeader } from '@/components/ui/Section';
import { StepCard } from '@/components/ui/Card';
import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

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

export function HowItWorks() {
  return (
    <Section id="how-it-works" theme="light">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-12">
        {/* Content Column */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sunshare-navy text-xs sm:text-sm font-medium tracking-[0.2em] uppercase mb-4">How It Works</p>
          <h2 className="h2 text-sunshare-deep mb-6">
            Take Control of Your Electricity, the Easy Way
          </h2>
          <p className="text-sunshare-gray mb-8">
            Filipinos now have the power to choose where their electricity comes from. SunShare makes that choice easy, transparent, and fair.
          </p>
          
          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-4 p-6 rounded-xl bg-sunshare-deep">
            <div className="text-center">
              <p className="text-2xl font-bold text-sunshare-lime">3</p>
              <p className="text-white/70 text-xs mt-1">Easy Steps</p>
            </div>
            <div className="text-center border-x border-white/10">
              <p className="text-2xl font-bold text-sunshare-lime">0</p>
              <p className="text-white/70 text-xs mt-1">Hidden Fees</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-sunshare-lime">100%</p>
              <p className="text-white/70 text-xs mt-1">Transparent</p>
            </div>
          </div>
        </motion.div>

        {/* Visual */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="relative">
            <OptimizedImage
              src="/images/sections/how-it-works-savings.jpg"
              alt="Customer reviewing simplified electricity options on a tablet"
              aspectRatio="3/2"
              overlay="gradient"
              className="rounded-xl shadow-lg max-h-[360px]"
            />
            <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-sunshare-navy/10 rounded-xl -z-10" />
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
