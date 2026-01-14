'use client';

import { Section, SectionHeader } from '@/components/ui/Section';
import { ImageServiceCard } from '@/components/ui/Card';
import { Zap, Sun, Battery, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

const solutions = [
  {
    icon: Zap,
    title: 'Lower Electricity Cost Today',
    description: 'Start saving right away by switching to SunShare, then grow into solar and battery solutions at your pace with guided onboarding and financing.',
    imageSrc: '/images/sections/solutions-cost-savings.jpg',
    imageAlt: 'Filipino homeowner celebrating lower electricity bills',
    objectPosition: 'center bottom',
  },
  {
    icon: Sun,
    title: 'Solar Made Simple',
    description: 'After switching, SunShare helps map your rooftop, match you with accredited solar installers, and give you access to solar bundles and financing options.',
    imageSrc: '/images/sections/solar-installation.jpg',
    imageAlt: 'Professional solar panel installation',
    objectPosition: 'center bottom',
  },
  {
    icon: Battery,
    title: 'Future-Ready with Battery Storage',
    description: 'Once your solar is running, SunShare supports you in adding battery storage for reliability, outage protection, and optimized energy use.',
    imageSrc: '/images/sections/home-battery.jpg',
    imageAlt: 'Home battery storage system mounted on wall',
    objectPosition: 'center',
  },
  {
    icon: BarChart3,
    title: 'Smarter Energy Management',
    description: 'Track usage, monitor savings, view your solar performance, and manage your SunShare bundles all in one digital dashboard.',
    imageSrc: '/images/sections/solutions-dashboard.jpg',
    imageAlt: 'Smart energy monitoring dashboard showing real-time savings',
    objectPosition: 'center top',
  },
];

export function Solutions() {
  return (
    <Section id="how-we-can-help" theme="accent-teal">
      {/* Decorative SVG */}
      <div className="absolute top-0 right-0 w-64 h-64 opacity-10 hidden lg:block">
        <svg viewBox="0 0 200 200" fill="none" className="w-full h-full text-sunshare-lime">
          <path 
            d="M100 0C155.23 0 200 44.77 200 100C200 155.23 155.23 200 100 200C44.77 200 0 155.23 0 100C0 44.77 44.77 0 100 0Z" 
            fill="currentColor"
          />
        </svg>
      </div>

      <SectionHeader
        kicker="How We Can Help"
        title="Empowering Your Community Through Smarter, Cheaper, and Cleaner Energy"
        subtitle="Start with lower electricity costs today, then unlock solar and battery savings with guided bundles and financing at every step."
        theme="dark"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {solutions.map((solution, index) => (
          <motion.div
            key={solution.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <ImageServiceCard
              icon={solution.icon}
              title={solution.title}
              description={solution.description}
              imageSrc={solution.imageSrc}
              imageAlt={solution.imageAlt}
              objectPosition={solution.objectPosition}
              className="h-full"
            />
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

export default Solutions;
