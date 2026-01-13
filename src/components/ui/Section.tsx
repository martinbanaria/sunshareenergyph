'use client';

import { motion } from 'framer-motion';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  background?: 'default' | 'gradient' | 'pattern';
}

export function Section({ children, className = '', id, background = 'default' }: SectionProps) {
  const bgClasses = {
    default: '',
    gradient: 'bg-gradient-to-b from-transparent via-sunshare-navy/20 to-transparent',
    pattern: 'bg-grid-pattern',
  };

  return (
    <section
      id={id}
      className={`py-16 md:py-24 lg:py-32 ${bgClasses[background]} ${className}`}
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

export function SectionHeader({ kicker, title, subtitle, centered = true, className = '' }: SectionHeaderProps) {
  return (
    <motion.div
      className={`${centered ? 'text-center' : ''} mb-12 md:mb-16 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {kicker && (
        <p className="kicker mb-4">{kicker}</p>
      )}
      <h2 className="h2 text-white mb-4">{title}</h2>
      {subtitle && (
        <p className={`body-large ${centered ? 'max-w-3xl mx-auto' : ''}`}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

export default Section;
