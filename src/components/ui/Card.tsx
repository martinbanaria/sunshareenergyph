'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

type CardTheme = 'dark' | 'light';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  variant?: 'default' | 'teal';
  theme?: CardTheme;
}

export function Card({ children, className = '', hover = true, variant = 'default', theme = 'dark' }: CardProps) {
  const hoverClass = variant === 'teal' ? 'card-teal' : '';
  const cardClass = theme === 'light' ? 'card-light' : 'card';
  
  return (
    <motion.div
      className={`${cardClass} ${hover ? hoverClass : ''} p-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
}

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
  theme?: CardTheme;
  imageSrc?: string;
  imageAlt?: string;
}

export function ServiceCard({ icon: Icon, title, description, className = '', theme = 'dark', imageSrc, imageAlt }: ServiceCardProps) {
  const cardClass = theme === 'light' ? 'card-light' : 'card';
  const titleColor = theme === 'light' ? 'text-sunshare-deep' : 'text-white';
  const textColor = theme === 'light' ? 'text-sunshare-gray' : 'body-text';
  const iconBg = theme === 'light' ? 'bg-sunshare-navy/10' : 'bg-sunshare-lime/10';
  const iconColor = theme === 'light' ? 'text-sunshare-navy' : 'text-sunshare-lime';
  
  return (
    <motion.div
      className={`${cardClass} flex flex-col overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {imageSrc && (
        <div className="relative h-48 -mx-6 -mt-6 mb-4 overflow-hidden">
          <img 
            src={imageSrc} 
            alt={imageAlt || title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-sunshare-deep/60 to-transparent" />
        </div>
      )}
      <div className="p-6">
        <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center mb-4`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        <h3 className={`h3 ${titleColor} mb-3`}>{title}</h3>
        <p className={`${textColor} flex-1`}>{description}</p>
      </div>
    </motion.div>
  );
}

interface ImageServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt?: string;
  className?: string;
}

export function ImageServiceCard({ icon: Icon, title, description, imageSrc, imageAlt, className = '' }: ImageServiceCardProps) {
  return (
    <motion.div
      className={`card flex flex-col overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={imageSrc} 
          alt={imageAlt || title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-sunshare-deep/80 via-sunshare-deep/20 to-transparent" />
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <div className="w-12 h-12 rounded-xl bg-sunshare-deep flex items-center justify-center mb-4 -mt-10 relative z-10 border-2 border-sunshare-lime shadow-lg">
          <Icon className="w-6 h-6 text-sunshare-lime" />
        </div>
        <h3 className="h3 text-white mb-3">{title}</h3>
        <p className="body-text flex-1">{description}</p>
      </div>
    </motion.div>
  );
}

interface StepCardProps {
  step: number;
  title: string;
  description: string;
  className?: string;
  theme?: CardTheme;
}

export function StepCard({ step, title, description, className = '', theme = 'dark' }: StepCardProps) {
  const cardClass = theme === 'light' ? 'card-light' : 'card';
  const titleColor = theme === 'light' ? 'text-sunshare-deep' : 'text-white';
  const textColor = theme === 'light' ? 'text-sunshare-gray' : 'body-text';
  
  return (
    <motion.div
      className={`${cardClass} p-6 relative ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute -top-4 left-6 w-8 h-8 rounded-full bg-sunshare-lime flex items-center justify-center">
        <span className="text-sunshare-deep font-bold text-sm">{step}</span>
      </div>
      <div className="pt-4">
        <h3 className={`h3 ${titleColor} mb-3`}>{title}</h3>
        <p className={textColor}>{description}</p>
      </div>
    </motion.div>
  );
}

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
  theme?: CardTheme;
}

export function FeatureCard({ icon: Icon, title, description, className = '', theme = 'dark' }: FeatureCardProps) {
  const titleColor = theme === 'light' ? 'text-sunshare-deep' : 'text-white';
  const textColor = theme === 'light' ? 'text-sunshare-gray' : 'body-text';
  const iconBg = theme === 'light' ? 'bg-sunshare-navy/10' : 'bg-sunshare-lime/10';
  const iconColor = theme === 'light' ? 'text-sunshare-navy' : 'text-sunshare-lime';
  
  return (
    <div className={`flex items-start gap-4 ${className}`}>
      <div className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center flex-shrink-0`}>
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <div>
        <h4 className={`font-semibold ${titleColor} mb-1`}>{title}</h4>
        <p className={`${textColor} text-sm`}>{description}</p>
      </div>
    </div>
  );
}

export default Card;
