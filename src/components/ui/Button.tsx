'use client';

import { forwardRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'outline-dark';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  external?: boolean;
  loading?: boolean;
  disabled?: boolean;
  comingSoon?: boolean;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-sunshare-lime text-sunshare-deep hover:bg-sunshare-lime/90 font-semibold hover:shadow-[0_0_20px_rgba(209,235,12,0.3)]',
  secondary: 'bg-white/10 text-white hover:bg-white/20 border border-white/20 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]',
  ghost: 'bg-transparent text-white hover:bg-white/10',
  outline: 'bg-transparent text-sunshare-lime border border-sunshare-lime hover:bg-sunshare-lime/10 hover:shadow-[0_0_15px_rgba(209,235,12,0.15)]',
  'outline-dark': 'bg-transparent text-sunshare-navy border border-sunshare-navy hover:bg-sunshare-navy/10 hover:shadow-[0_0_15px_rgba(0,79,100,0.15)]',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm rounded-lg',
  md: 'px-6 py-3 text-base rounded-xl',
  lg: 'px-8 py-4 text-lg rounded-xl',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    variant = 'primary', 
    size = 'md', 
    href, 
    external = false,
    loading = false,
    comingSoon = false,
    className = '', 
    children, 
    disabled,
    onClick,
    type = 'button',
  }, ref) => {
    const [showTooltip, setShowTooltip] = useState(false);
    
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';
    const comingSoonStyles = comingSoon ? 'opacity-40 cursor-not-allowed pointer-events-none' : '';
    const combinedStyles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${comingSoonStyles} ${className}`;

    const content = (
      <>
        {loading && (
          <svg 
            className="animate-spin -ml-1 mr-2 h-4 w-4" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {children}
      </>
    );

    // Coming Soon tooltip wrapper
    const TooltipWrapper = ({ children: tooltipChildren }: { children: React.ReactNode }) => (
      <span 
        className="relative inline-flex"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {tooltipChildren}
        <AnimatePresence>
          {showTooltip && comingSoon && (
            <motion.span
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.15 }}
              className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 text-xs font-medium text-sunshare-deep bg-sunshare-lime rounded whitespace-nowrap z-50"
            >
              Coming Soon
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    );

    // If comingSoon, render as non-interactive span
    if (comingSoon) {
      return (
        <TooltipWrapper>
          <span className={combinedStyles} aria-disabled="true">
            {content}
          </span>
        </TooltipWrapper>
      );
    }

    if (href) {
      if (external) {
        return (
          <motion.a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={combinedStyles}
            whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.97 }}
          >
            {content}
          </motion.a>
        );
      }
      return (
        <Link href={href} className={combinedStyles}>
          <motion.span
            className="inline-flex items-center justify-center w-full"
            whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.97 }}
          >
            {content}
          </motion.span>
        </Link>
      );
    }

    return (
      <motion.button
        ref={ref}
        type={type}
        className={combinedStyles}
        disabled={disabled || loading}
        onClick={onClick}
        whileHover={{ scale: disabled ? 1 : 1.03, transition: { duration: 0.2 } }}
        whileTap={{ scale: disabled ? 1 : 0.97 }}
      >
        {content}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
