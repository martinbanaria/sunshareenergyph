'use client';

import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const SIGNUP_URL = 'https://studio--sunshare-registration-portal.us-central1.hosted.app/signup-member';

export function CTA() {
  return (
    <Section className="relative overflow-hidden" theme="dark">
      {/* Enhanced gradient backgrounds */}
      <div className="absolute inset-0 bg-gradient-to-br from-sunshare-navy/60 via-sunshare-deep to-sunshare-deep" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-sunshare-lime/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-radiant-teal/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      
      {/* Decorative SVG shapes */}
      <svg 
        className="absolute top-0 right-0 w-64 h-64 text-sunshare-lime/5"
        viewBox="0 0 200 200"
        fill="none"
      >
        <path 
          d="M0 0H200V200C200 89.54 111.46 0 0 0Z" 
          fill="currentColor"
        />
      </svg>
      <svg 
        className="absolute bottom-0 left-0 w-48 h-48 text-radiant-teal/5"
        viewBox="0 0 200 200"
        fill="none"
      >
        <circle cx="100" cy="100" r="100" fill="currentColor" />
      </svg>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative z-10 text-center max-w-3xl mx-auto"
      >
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-sunshare-lime text-xs sm:text-sm font-medium tracking-[0.2em] uppercase mb-4"
        >
          Let&apos;s Get Started
        </motion.p>
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="h2 text-white mb-6"
        >
          Ready to Watch Your Savings Grow?
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="body-large max-w-2xl mx-auto mb-10"
        >
          Join the renewable revolution. Invest in solar, reduce your energy 
          spending, and help build a sustainable future.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button href={SIGNUP_URL} external size="lg" comingSoon>
            Join Us
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button href="/contact" variant="secondary" size="lg">
            Contact Us
          </Button>
        </motion.div>
      </motion.div>
    </Section>
  );
}

export default CTA;
