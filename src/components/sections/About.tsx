'use client';

import { motion } from 'framer-motion';
import { Section, SectionHeader } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
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

        {/* Visual with Image */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative"
        >
          {/* Image with overlay */}
          <div className="relative rounded-xl overflow-hidden mb-6">
            <OptimizedImage
              src="/images/sections/community.jpg"
              alt="Filipino community benefiting from clean energy solutions"
              overlay="gradient"
              aspectRatio="16/9"
            />
          </div>
          
          {/* Stats card overlapping the image */}
          <div className="card p-6 lg:p-8 -mt-20 mx-4 relative z-10">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="metric text-sunshare-lime">7-12%</p>
                <p className="body-text text-sm mt-1">Immediate Savings</p>
              </div>
              <div className="text-center">
                <p className="metric text-sunshare-lime">30%</p>
                <p className="body-text text-sm mt-1">With Solar</p>
              </div>
              <div className="text-center">
                <p className="metric text-sunshare-lime">82%</p>
                <p className="body-text text-sm mt-1">With Solar + BESS</p>
              </div>
              <div className="text-center">
                <p className="metric text-radiant-teal">24/7</p>
                <p className="body-text text-sm mt-1">Energy Support</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}

export default About;
