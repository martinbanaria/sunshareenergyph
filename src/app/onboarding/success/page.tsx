'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Home, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function OnboardingSuccessPage() {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Trigger confetti animation after mount
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sunshare-cream to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="mb-8"
        >
          <div className="relative inline-block">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-14 h-14 text-green-600" />
            </div>
            {showConfetti && (
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 2 }}
                className="absolute inset-0"
              >
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ 
                      x: 0, 
                      y: 0, 
                      scale: 0,
                      rotate: 0 
                    }}
                    animate={{ 
                      x: (Math.random() - 0.5) * 150, 
                      y: (Math.random() - 0.5) * 150 - 50,
                      scale: [0, 1, 0],
                      rotate: Math.random() * 360
                    }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96E6A1'][i % 5],
                    }}
                  />
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-3xl font-bold text-sunshare-deep mb-4">
            Welcome to SunShare!
          </h1>
          <p className="text-sunshare-gray mb-6">
            Your account has been successfully created. Our team will review your 
            application and contact you within 1-2 business days.
          </p>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <h2 className="font-semibold text-sunshare-navy mb-4">What happens next?</h2>
          <ul className="text-left text-sm text-sunshare-gray space-y-3">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-sunshare-gold/20 rounded-full flex items-center justify-center text-sunshare-gold font-bold text-xs">1</span>
              <span>Our team reviews your application and verifies your documents</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-sunshare-gold/20 rounded-full flex items-center justify-center text-sunshare-gold font-bold text-xs">2</span>
              <span>We&apos;ll schedule a property assessment to design your solar solution</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-sunshare-gold/20 rounded-full flex items-center justify-center text-sunshare-gold font-bold text-xs">3</span>
              <span>Sign your agreement and start saving with clean energy</span>
            </li>
          </ul>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-sunshare-navy text-white rounded-lg hover:bg-sunshare-deep transition-colors"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
          <Link
            href="/how-it-works"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-sunshare-navy text-sunshare-navy rounded-lg hover:bg-sunshare-navy/5 transition-colors"
          >
            Learn More
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Support Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-8 text-sm text-sunshare-gray"
        >
          Questions? Contact us at{' '}
          <a href="mailto:support@sunshare.ph" className="text-sunshare-gold hover:underline">
            support@sunshare.ph
          </a>
        </motion.p>
      </div>
    </div>
  );
}
