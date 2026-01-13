'use client';

import { motion } from 'framer-motion';

type SectionSpacing = 'default' | 'compact' | 'tight';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  background?: 'default' | 'gradient' | 'pattern';
  spacing?: SectionSpacing;
}

const spacingStyles: Record<SectionSpacing, string> = {
  default: 'py-16 md:py-24 lg:py-32',
  compact: 'py-12 md:py-16 lg:py-20',
  tight: 'py-8 md:py-12',
};

export function Section({ children, className = '', id, background = 'default', spacing = 'default' }: SectionProps) {
  const bgClasses = {
    default: '',
    gradient: 'bg-gradient-to-b from-transparent via-sunshare-navy/20 to-transparent',
    pattern: 'bg-grid-pattern',
  };

  return (
    <section
      id={id}
      className={`${spacingStyles[spacing]} ${bgClasses[background]} ${className}`}
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
        {children}
      </div>
    </section>
  );
}

interface SectionHeaderProps {
  kicker?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

const headerStagger = {
  initial: {},
  whileInView: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const headerItem = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
};

export function SectionHeader({ kicker, title, subtitle, centered = true, className = '' }: SectionHeaderProps) {
  return (
    <motion.div
      className={`${centered ? 'text-center' : ''} mb-12 md:mb-16 ${className}`}
      variants={headerStagger}
      initial="initial"
      whileInView="whileInView"
      viewport={{ once: true }}
    >
      {kicker && (
        <motion.p 
          className="kicker mb-4"
          variants={headerItem}
          transition={{ duration: 0.5 }}
        >
          {kicker}
        </motion.p>
      )}
      <motion.h2 
        className="h2 text-white mb-4"
        variants={headerItem}
        transition={{ duration: 0.5 }}
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p 
          className={`body-large ${centered ? 'max-w-3xl mx-auto' : ''}`}
          variants={headerItem}
          transition={{ duration: 0.5 }}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}

export default Section;
