'use client';

import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const SIGNUP_URL = 'https://studio--sunshare-registration-portal.us-central1.hosted.app/signup-member';

export function CTA() {
  return (
    <Section className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-sunshare-navy/50 via-transparent to-radiant-teal/20" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative z-10 card p-8 md:p-12 lg:p-16 text-center"
      >
        <p className="kicker mb-4">Let&apos;s Get Started</p>
        <h2 className="h2 text-white mb-6">
          Ready to Watch Your Savings Grow?
        </h2>
        <p className="body-large max-w-2xl mx-auto mb-8">
          Join the renewable revolution. Invest in solar, reduce your energy 
          spending, and help build a sustainable future.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button href={SIGNUP_URL} external size="lg" comingSoon>
            Join Us
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button href="/contact" variant="secondary" size="lg">
            Contact Us
          </Button>
        </div>
      </motion.div>
    </Section>
  );
}

export default CTA;
