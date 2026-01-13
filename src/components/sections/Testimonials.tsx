'use client';

import { Section, SectionHeader } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Quote } from 'lucide-react';

const testimonial = {
  quote: "Every community has a story, and we cannot wait to be part of yours. SunShare is on a mission to empower Filipino families, SMEs, condos, and villages with energy that is cheaper, cleaner, and smarter. As we launch SunShare, we are excited to create real impact and build a brighter energy future together.",
  author: "SunShare Team",
  role: "Proudly Co-Creating With Filipino Communities",
};

export function Testimonials() {
  return (
    <Section id="testimonials" background="gradient">
      <SectionHeader
        kicker="Community Stories"
        title="Building a Brighter Future Together"
        subtitle="We're committed to empowering Filipino communities with energy solutions that make a real difference."
      />

      <div className="max-w-3xl mx-auto">
        <Card className="p-8 md:p-12 text-center relative">
          {/* Quote icon */}
          <div className="w-12 h-12 rounded-full bg-sunshare-lime/10 flex items-center justify-center mx-auto mb-6">
            <Quote className="w-6 h-6 text-sunshare-lime" />
          </div>

          {/* Quote */}
          <blockquote className="text-lg md:text-xl text-white/90 leading-relaxed mb-8 font-serif italic">
            &ldquo;{testimonial.quote}&rdquo;
          </blockquote>

          {/* Author */}
          <div>
            <p className="font-semibold text-white">{testimonial.author}</p>
            <p className="text-sm text-white/60">{testimonial.role}</p>
          </div>
        </Card>
      </div>
    </Section>
  );
}

export default Testimonials;
