'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Star, Send } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { trackFeedback } from '@/lib/analytics/onboarding';

interface FeedbackWidgetProps {
  currentStep?: number;
  onClose?: () => void;
}

export function FeedbackWidget({ currentStep, onClose }: FeedbackWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return;

    setIsSubmitting(true);

    try {
      // Track feedback
      trackFeedback(rating, comment, currentStep);

      // Send to feedback API (optional)
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          comment,
          step: currentStep,
          timestamp: new Date().toISOString(),
        }),
      });

      setIsSubmitted(true);
      
      // Auto-close after 2 seconds
      setTimeout(() => {
        setIsOpen(false);
        onClose?.();
      }, 2000);
    } catch (error) {
      console.error('Feedback submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <div className="bg-green-500 text-white p-4 rounded-lg shadow-lg">
          <p className="font-medium">Thank you for your feedback! 🙏</p>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      {/* Feedback Button */}
      {!isOpen && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 3 }} // Show after 3 seconds
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 z-50 bg-sunshare-navy hover:bg-sunshare-deep text-white p-3 rounded-full shadow-lg transition-colors"
          title="Send Feedback"
        >
          <MessageCircle className="w-6 h-6" />
        </motion.button>
      )}

      {/* Feedback Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={handleClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-sunshare-deep">
                  How is your experience?
                </h3>
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {currentStep && (
                <p className="text-sm text-gray-600 mb-4">
                  You're currently on Step {currentStep} of the onboarding process.
                </p>
              )}

              {/* Star Rating */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Rate your experience:
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className={`p-1 transition-colors ${
                        star <= rating
                          ? 'text-yellow-500'
                          : 'text-gray-300 hover:text-yellow-400'
                      }`}
                    >
                      <Star className="w-6 h-6 fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Additional feedback (optional):
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us what you think or if you encountered any issues..."
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-sunshare-navy focus:border-transparent"
                  rows={3}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={rating === 0 || isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? (
                    'Sending...'
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Feedback
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}