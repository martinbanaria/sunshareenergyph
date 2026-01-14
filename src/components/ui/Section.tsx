'use client';

import { motion } from 'framer-motion';

type SectionSpacing = 'default' | 'compact' | 'tight';
type SectionTheme = 'dark' | 'light' | 'accent-teal';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  background?: 'default' | 'gradient' | 'pattern';
  spacing?: SectionSpacing;
  theme?: SectionTheme;
}

const spacingStyles: Record<SectionSpacing, string> = {
  default: 'py-16 md:py-24 lg:py-32',
  compact: 'py-12 md:py-16 lg:py-20',
  tight: 'py-8 md:py-12',
};

const themeStyles: Record<SectionTheme, string> = {
  dark: 'bg-sunshare-deep text-white',
  light: 'section-light',
  'accent-teal': 'section-accent-teal text-white',
};

export function Section({ children, className = '', id, background = 'default', spacing = 'default', theme }: SectionProps) {
  const bgClasses = {
    default: '',
    gradient: 'bg-gradient-to-b from-transparent via-sunshare-navy/20 to-transparent',
    pattern: 'bg-grid-pattern',
  };

  const themeClass = theme ? themeStyles[theme] : '';

  return (
    <section
      id={id}
      data-theme={theme || 'dark'}
      className={`${spacingStyles[spacing]} ${bgClasses[background]} ${themeClass} ${className}`}
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
  theme?: 'dark' | 'light';
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

export function SectionHeader({ kicker, title, subtitle, centered = true, className = '', theme = 'dark' }: SectionHeaderProps) {
  const kickerColor = theme === 'light' ? 'text-sunshare-navy' : 'kicker';
  const titleColor = theme === 'light' ? 'text-sunshare-deep' : 'text-white';
  const subtitleColor = theme === 'light' ? 'text-sunshare-gray' : 'body-large';

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
          className={`${kickerColor} mb-4 text-xs sm:text-sm font-medium tracking-[0.2em] uppercase`}
          variants={headerItem}
          transition={{ duration: 0.5 }}
        >
          {kicker}
        </motion.p>
      )}
      <motion.h2 
        className={`h2 ${titleColor} mb-4`}
        variants={headerItem}
        transition={{ duration: 0.5 }}
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p 
          className={`${subtitleColor} ${centered ? 'max-w-3xl mx-auto' : ''} ${theme === 'light' ? 'text-sunshare-gray' : ''}`}
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
