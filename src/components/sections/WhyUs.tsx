'use client';

import { useState, useEffect } from 'react';
import { Section } from '@/components/ui/Section';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Building2, Users, Heart, LucideIcon } from 'lucide-react';

interface Audience {
  icon: LucideIcon;
  title: string;
  shortTitle: string;
  description: string;
  color: string;
}

const audiences: Audience[] = [
  {
    icon: Home,
    title: 'For Homeowners',
    shortTitle: 'Homeowners',
    description: 'Whether you live in a small house or a condo unit, you deserve access to cleaner, cheaper power. We make it possible for you too.',
    color: 'from-amber-50 to-orange-50',
  },
  {
    icon: Building2,
    title: 'For Small Businesses',
    shortTitle: 'Small Businesses',
    description: "You don't need to be a big corporation to benefit. SunShare levels the playing field so SMEs can compete with lower energy costs.",
    color: 'from-blue-50 to-indigo-50',
  },
  {
    icon: Users,
    title: 'For Communities',
    shortTitle: 'Communities',
    description: 'We believe in the power of sharing. By aggregating demand, even small players get rates that were once reserved for the biggest consumers.',
    color: 'from-green-50 to-emerald-50',
  },
  {
    icon: Heart,
    title: 'Because We Actually Care',
    shortTitle: 'We Care',
    description: "This isn't just business. We're building a future where every Filipino, regardless of size, can share in the energy of the sun.",
    color: 'from-rose-50 to-pink-50',
  },
];

export function WhyUs() {
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-rotate through audiences
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % audiences.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const ActiveIcon = audiences[activeIndex].icon;

  return (
    <Section id="why-us" theme="light">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sunshare-navy text-xs sm:text-sm font-medium tracking-[0.2em] uppercase mb-4">
            Why Choose SunShare
          </p>
          <h2 className="h2 text-sunshare-deep mb-4">
            We Include Everyone in the Energy Transition
          </h2>
          <p className="text-sunshare-gray text-lg">
            Big or small, home or business, everyone deserves access to smarter, cleaner, and more affordable energy.
          </p>
        </motion.div>
      </div>

      {/* Spotlight Gallery */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col lg:flex-row gap-4 lg:gap-6 max-w-5xl mx-auto"
      >
        {/* Featured Panel */}
        <div className="lg:flex-1 min-h-[280px] lg:min-h-[320px] relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`absolute inset-0 rounded-2xl p-8 lg:p-10 bg-gradient-to-br ${audiences[activeIndex].color}`}
            >
              <div className="flex flex-col h-full justify-center">
                <div className="w-16 h-16 rounded-xl bg-white/80 backdrop-blur flex items-center justify-center mb-6 shadow-lg">
                  <ActiveIcon className="w-8 h-8 text-sunshare-deep" />
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-sunshare-navy mb-3">
                  {audiences[activeIndex].title}
                </h3>
                <p className="text-base lg:text-lg text-sunshare-deep/80 leading-relaxed max-w-md">
                  {audiences[activeIndex].description}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Tabs */}
        <div className="flex lg:flex-col gap-2 lg:gap-3 lg:w-56 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
          {audiences.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={index}
                onClick={() => setActiveIndex(index)}
                whileHover={{ scale: 1.02, x: 2 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-3 p-3 lg:p-4 rounded-xl text-left transition-all
                           flex-shrink-0 lg:flex-shrink min-w-[140px] lg:min-w-0
                           ${activeIndex === index
                             ? 'bg-sunshare-navy text-white shadow-lg'
                             : 'bg-sunshare-gray/10 text-sunshare-navy hover:bg-sunshare-gray/20'}`}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${activeIndex === index ? 'text-sunshare-lime' : 'text-sunshare-deep'}`} />
                <span className="font-medium text-sm whitespace-nowrap lg:whitespace-normal">
                  {item.shortTitle}
                </span>
                {activeIndex === index && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="ml-auto w-2 h-2 rounded-full bg-sunshare-lime flex-shrink-0"
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </Section>
  );
}

export default WhyUs;
