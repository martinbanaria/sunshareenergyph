'use client';

import { Section, SectionHeader } from '@/components/ui/Section';
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
    <Section id="why-us">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Visual */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="order-2 lg:order-1"
        >
          <div className="card p-8 lg:p-12 relative overflow-hidden">
            {/* Decorative gradient */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-sunshare-lime/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-sunshare-lime/10 flex items-center justify-center mb-6">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="h3 text-white mb-4">Energy Made Simple</h3>
              <p className="body-text mb-6">
                SunShare takes the complexity out of clean energy. We make lowering 
                electricity costs effortless with a streamlined process, transparent 
                tools, and trusted partners.
              </p>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-2xl font-bold text-sunshare-lime">7-12%</p>
                  <p className="text-sm text-white/70">Immediate Savings</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-2xl font-bold text-radiant-teal">24/7</p>
                  <p className="text-sm text-white/70">Energy Support</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="order-1 lg:order-2"
        >
          <p className="kicker mb-4">Why Choose SunShare Energy</p>
          <h2 className="h2 text-white mb-6">
            Energy Made Simple, Savings Made Smarter
          </h2>
          <p className="body-text mb-8">
            SunShare takes the complexity out of clean energy. We make lowering 
            electricity costs effortless with a streamlined process, transparent 
            tools, and trusted partners—so homes, communities, and businesses can 
            power up with confidence.
          </p>
          
          <div className="space-y-4">
            {features.map((feature) => (
              <div key={feature} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-sunshare-lime/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-sunshare-lime" />
                </div>
                <span className="text-white/90">{feature}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </Section>
  );
}

export default WhyUs;
