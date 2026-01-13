'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  variant?: 'default' | 'teal';
}

export function Card({ children, className = '', hover = true, variant = 'default' }: CardProps) {
  const hoverClass = variant === 'teal' ? 'card-teal' : '';
  
  return (
    <motion.div
      className={`card ${hover ? hoverClass : ''} p-6 ${className}`}
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
}

export function ServiceCard({ icon: Icon, title, description, className = '' }: ServiceCardProps) {
  return (
    <Card className={`flex flex-col ${className}`}>
      <div className="w-12 h-12 rounded-xl bg-sunshare-lime/10 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-sunshare-lime" />
      </div>
      <h3 className="h3 text-white mb-3">{title}</h3>
      <p className="body-text flex-1">{description}</p>
    </Card>
  );
}

interface StepCardProps {
  step: number;
  title: string;
  description: string;
  className?: string;
}

export function StepCard({ step, title, description, className = '' }: StepCardProps) {
  return (
    <Card className={`relative ${className}`}>
      <div className="absolute -top-4 left-6 w-8 h-8 rounded-full bg-sunshare-lime flex items-center justify-center">
        <span className="text-sunshare-deep font-bold text-sm">{step}</span>
      </div>
      <div className="pt-4">
        <h3 className="h3 text-white mb-3">{title}</h3>
        <p className="body-text">{description}</p>
      </div>
    </Card>
  );
}

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

export function FeatureCard({ icon: Icon, title, description, className = '' }: FeatureCardProps) {
  return (
    <div className={`flex items-start gap-4 ${className}`}>
      <div className="w-10 h-10 rounded-lg bg-sunshare-lime/10 flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-sunshare-lime" />
      </div>
      <div>
        <h4 className="font-semibold text-white mb-1">{title}</h4>
        <p className="body-text text-sm">{description}</p>
      </div>
    </div>
  );
}

export default Card;
