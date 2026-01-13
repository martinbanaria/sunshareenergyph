'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';
import { fadeUpBlur, staggerContainer, staggerItem, transitions } from '@/lib/animations';

const SIGNUP_URL = 'https://studio--sunshare-registration-portal.us-central1.hosted.app/signup-member';

export function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Parallax transforms for decorative elements
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-grid-pattern"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-sunshare-deep via-sunshare-deep to-sunshare-navy/30" />
      
      {/* Decorative elements with parallax */}
      <motion.div 
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-sunshare-lime/5 rounded-full blur-3xl"
        style={{ y: y1 }}
      />
      <motion.div 
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-radiant-teal/5 rounded-full blur-3xl"
        style={{ y: y2 }}
      />

      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl relative z-10">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.p
            variants={fadeUpBlur}
            transition={transitions.tweenSmooth}
            className="kicker mb-6"
          >
            The Future of Energy in the Philippines
          </motion.p>

          <motion.h1
            variants={fadeUpBlur}
            transition={{ ...transitions.tweenSmooth, delay: 0.1 }}
            className="h1 text-white mb-6"
          >
            Powering Filipinos with{' '}
            <span className="text-gradient">Smarter, Cheaper, and Cleaner</span>{' '}
            Energy
          </motion.h1>

          <motion.p
            variants={fadeUpBlur}
            transition={{ ...transitions.tweenSmooth, delay: 0.2 }}
            className="body-large max-w-2xl mx-auto mb-10"
          >
            Access affordable, reliable, and sustainable clean energy—by sharing 
            the power of community for a brighter, greener tomorrow.
          </motion.p>

          <motion.div
            variants={staggerItem}
            transition={{ ...transitions.tweenSmooth, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button href={SIGNUP_URL} external size="lg" comingSoon>
              Get Started
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button href="/solutions" variant="secondary" size="lg">
              Learn More
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        style={{ opacity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2"
        >
          <div className="w-1 h-2 bg-white/40 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}

export default Hero;
