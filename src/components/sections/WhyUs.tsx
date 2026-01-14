'use client';

import { Section } from '@/components/ui/Section';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  'Competitive rates through aggregated demand',
  'Verified and traceable clean power',
  'Real-time dashboards for monitoring',
  'Easy access to trusted installation and financing partners',
];

export function WhyUs() {
  return (
    <Section id="why-us" theme="light">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="order-1"
        >
          <p className="text-sunshare-navy text-xs sm:text-sm font-medium tracking-[0.2em] uppercase mb-4">Why Choose SunShare Energy</p>
          <h2 className="h2 text-sunshare-deep mb-6">
            Energy Made Simple, Savings Made Smarter
          </h2>
          <p className="text-sunshare-gray mb-8">
            SunShare takes the complexity out of clean energy. We make lowering 
            electricity costs effortless with a streamlined process, transparent 
            tools, and trusted partners—so homes, communities, and businesses can 
            power up with confidence.
          </p>
          
          <div className="space-y-4">
            {features.map((feature) => (
              <div key={feature} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-sunshare-navy/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-sunshare-navy" />
                </div>
                <span className="text-sunshare-deep">{feature}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="order-2"
        >
          <div className="relative">
            <OptimizedImage
              src="/images/sections/whyus-solar-rooftop.jpg"
              alt="Professional solar installation on a Filipino home rooftop"
              aspectRatio="4/3"
              overlay="gradient"
              className="rounded-xl shadow-lg"
            />
            {/* Decorative frame accent */}
            <div className="absolute -bottom-4 -left-4 w-full h-full border-2 border-sunshare-navy/20 rounded-xl -z-10" />
            
            {/* Stats badge */}
            <div className="absolute bottom-6 left-6 right-6 card-light p-4 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <p className="text-2xl font-bold text-sunshare-navy">7-12%</p>
                  <p className="text-xs text-sunshare-gray">Immediate Savings</p>
                </div>
                <div className="w-px h-10 bg-sunshare-navy/10" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-radiant-teal">24/7</p>
                  <p className="text-xs text-sunshare-gray">Energy Support</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}

export default WhyUs;
