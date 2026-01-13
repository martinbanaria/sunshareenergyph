import { Variants, Transition } from 'framer-motion';

// Fade up animation
export const fadeUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

// Fade up with blur effect
export const fadeUpBlur: Variants = {
  initial: { opacity: 0, y: 20, filter: 'blur(10px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: 20, filter: 'blur(10px)' },
};

// Scale up animation
export const scaleUp: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

// Slide from left
export const slideFromLeft: Variants = {
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 },
};

// Slide from right
export const slideFromRight: Variants = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 30 },
};

// Stagger container for children animations
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

// Stagger item (child of stagger container)
export const staggerItem: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

// Transition presets
export const transitions = {
  spring: {
    type: 'spring',
    stiffness: 300,
    damping: 30,
  } as Transition,
  springBouncy: {
    type: 'spring',
    stiffness: 400,
    damping: 25,
  } as Transition,
  tween: {
    type: 'tween',
    duration: 0.3,
    ease: 'easeOut',
  } as Transition,
  tweenSlow: {
    type: 'tween',
    duration: 0.5,
    ease: 'easeOut',
  } as Transition,
  tweenSmooth: {
    type: 'tween',
    duration: 0.4,
    ease: [0.25, 0.46, 0.45, 0.94],
  } as Transition,
};

// Viewport settings for scroll-triggered animations
export const viewportSettings = {
  once: true,
  margin: '-50px',
  amount: 0.3 as const,
};

// Float animation for decorative elements
export const floatAnimation = {
  y: [0, -10, 0],
  transition: {
    duration: 4,
    repeat: Infinity,
    ease: 'easeInOut',
  },
};

// Gentle rotation float for decorative elements
export const floatRotateAnimation = {
  y: [0, -8, 0],
  rotate: [0, 2, 0],
  transition: {
    duration: 5,
    repeat: Infinity,
    ease: 'easeInOut',
  },
};

// Button hover animation preset
export const buttonHover = {
  scale: 1.02,
  transition: { duration: 0.2 },
};

// Button tap animation preset
export const buttonTap = {
  scale: 0.98,
};

// Glow effect animation (for use with box-shadow)
export const glowPulse = {
  boxShadow: [
    '0 0 20px rgba(209, 235, 12, 0.15)',
    '0 0 30px rgba(209, 235, 12, 0.25)',
    '0 0 20px rgba(209, 235, 12, 0.15)',
  ],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: 'easeInOut',
  },
};
