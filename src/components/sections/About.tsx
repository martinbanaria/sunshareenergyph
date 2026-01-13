'use client';

import { motion } from 'framer-motion';
import { Section, SectionHeader } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';

export function About() {
  return (
    <Section id="about-us" background="gradient">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="kicker mb-4">About SunShare Energy</p>
          <h2 className="h2 text-white mb-6">
            Transforming the Way Filipino Communities and Businesses Experience Energy
          </h2>
          <div className="space-y-4 body-text mb-8">
            <p>
              Across the Philippines, families, condos, offices, buildings, and small 
              businesses all face the same challenge: electricity that keeps getting 
              more expensive, less reliable, and harder to manage.
            </p>
            <p>
              SunShare is changing that by bringing communities and enterprises a 
              smarter, cleaner, and more affordable way to power everyday life and 
              operations. We make the shift simple.
            </p>
            <p>
              This is not just about cutting costs. It is about giving Filipinos more 
              control, more reliability during outages, and more confidence in a cleaner 
              future.
            </p>
          </div>
          <Button href="/about" variant="outline">
            Learn More About Us
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </motion.div>

        {/* Visual */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative"
        >
          <div className="card p-8 lg:p-12">
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <p className="metric text-sunshare-lime">7-12%</p>
                <p className="body-text mt-2">Immediate Savings</p>
              </div>
              <div className="text-center">
                <p className="metric text-sunshare-lime">30%</p>
                <p className="body-text mt-2">With Solar</p>
              </div>
              <div className="text-center">
                <p className="metric text-sunshare-lime">82%</p>
                <p className="body-text mt-2">With Solar + BESS</p>
              </div>
              <div className="text-center">
                <p className="metric text-radiant-teal">24/7</p>
                <p className="body-text mt-2">Energy Support</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}

export default About;
