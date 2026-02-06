'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  completedSteps: number[];
  stepTitles: string[];
}

export function StepIndicator({
  currentStep,
  totalSteps,
  completedSteps,
  stepTitles,
}: StepIndicatorProps) {
  return (
    <div className="relative">
      {/* Progress bar background */}
      <div className="absolute top-5 left-0 right-0 h-0.5 bg-sunshare-deep/10" />
      
      {/* Active progress bar */}
      <motion.div
        className="absolute top-5 left-0 h-0.5 bg-sunshare-lime"
        initial={{ width: '0%' }}
        animate={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        transition={{ duration: 0.3 }}
      />

      {/* Steps */}
      <div className="relative flex justify-between">
        {Array.from({ length: totalSteps }, (_, i) => {
          const stepNumber = i + 1;
          const isCompleted = completedSteps.includes(stepNumber);
          const isCurrent = currentStep === stepNumber;
          const isPast = stepNumber < currentStep;

          return (
            <div key={stepNumber} className="flex flex-col items-center">
              <motion.div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold
                  transition-colors duration-300
                  ${isCompleted || isPast
                    ? 'bg-sunshare-lime text-sunshare-deep'
                    : isCurrent
                    ? 'bg-sunshare-navy text-white'
                    : 'bg-sunshare-deep/10 text-sunshare-gray'
                  }
                `}
                initial={{ scale: 0.8 }}
                animate={{ scale: isCurrent ? 1.1 : 1 }}
                transition={{ duration: 0.2 }}
              >
                {isCompleted || isPast ? (
                  <Check className="w-5 h-5" />
                ) : (
                  stepNumber
                )}
              </motion.div>
              
              {/* Step title - hidden on mobile */}
              <span
                className={`
                  hidden md:block mt-2 text-xs text-center max-w-[80px]
                  ${isCurrent ? 'text-sunshare-navy font-medium' : 'text-sunshare-gray'}
                `}
              >
                {stepTitles[i]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
