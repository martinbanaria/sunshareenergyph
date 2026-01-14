'use client';

import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { Quote } from 'lucide-react';
import { motion } from 'framer-motion';

const testimonial = {
  quote: "Every community has a story, and we cannot wait to be part of yours. SunShare is on a mission to empower Filipino families, SMEs, condos, and villages with energy that is cheaper, cleaner, and smarter. As we launch SunShare, we are excited to create real impact and build a brighter energy future together.",
  author: "SunShare Team",
  role: "Proudly Co-Creating With Filipino Communities",
};

export function Testimonials() {
  return (
    <Section id="testimonials" theme="light">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Image Column */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <OptimizedImage
            src="/images/sections/testimonials-partnership.jpg"
            alt="SunShare team partnering with Filipino community leaders"
            aspectRatio="4/3"
            overlay="gradient"
            className="rounded-xl shadow-lg"
          />
          {/* Decorative accent */}
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-sunshare-lime/20 rounded-full blur-2xl" />
        </motion.div>

        {/* Content Column */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p className="text-sunshare-navy text-xs sm:text-sm font-medium tracking-[0.2em] uppercase mb-4">Community Stories</p>
          <h2 className="h2 text-sunshare-deep mb-8">
            Building a Brighter Future Together
          </h2>

          <div className="card-light p-8 relative">
            {/* Quote icon */}
            <div className="w-12 h-12 rounded-full bg-sunshare-navy/10 flex items-center justify-center mb-6">
              <Quote className="w-6 h-6 text-sunshare-navy" />
            </div>

            {/* Quote */}
            <blockquote className="text-lg text-sunshare-deep leading-relaxed mb-8 font-serif italic">
              &ldquo;{testimonial.quote}&rdquo;
            </blockquote>

            {/* Author */}
            <div>
              <p className="font-semibold text-sunshare-deep">{testimonial.author}</p>
              <p className="text-sm text-sunshare-gray">{testimonial.role}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}

export default Testimonials;
