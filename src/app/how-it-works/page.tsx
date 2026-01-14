'use client';

import { motion } from 'framer-motion';
import { Section, SectionHeader } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Check, FileCheck, Users, Zap, HelpCircle, Shield, TrendingUp } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 }
};

const steps = [
  {
    step: 1,
    title: 'Join Us to Assess Your Eligibility',
    description: 'We\'ll review your energy demand and confirm you meet ERC requirements so you can choose your supplier with confidence.',
    details: [
      'Submit your basic information and energy bills',
      'Our team reviews your eligibility for the Retail Aggregation Program',
      'We confirm you meet ERC requirements',
      'Receive a personalized savings estimate',
    ],
    icon: FileCheck,
    image: '/images/sections/how-it-works-eligibility.jpg',
    imageAlt: 'Filipino homeowner reviewing electricity bills for eligibility assessment',
  },
  {
    step: 2,
    title: 'Organize and Facilitate Your Application',
    description: 'We\'ll handle all the details and guide you through a smooth, hassle-free application process.',
    details: [
      'SunShare prepares all required documentation',
      'We coordinate with your current utility provider',
      'Our team handles the administrative process',
      'You\'re kept informed at every step',
    ],
    icon: Users,
    image: '/images/sections/how-it-works-application.jpg',
    imageAlt: 'SunShare consultant guiding customer through application process',
  },
  {
    step: 3,
    title: 'Enjoy Lower, Predictable Monthly Bills',
    description: 'Make the switch and start saving with better rates and more consistent, reliable monthly costs.',
    details: [
      'Your switch is activated seamlessly',
      'Start enjoying 7-12% lower electricity rates',
      'Monitor your savings through our dashboard',
      'Access additional solar and battery solutions when ready',
    ],
    icon: Zap,
    image: '/images/sections/how-it-works-savings.jpg',
    imageAlt: 'Happy Filipino family enjoying lower electricity bills at home',
  },
];

const benefits = [
  {
    title: 'Empower users to choose',
    description: 'Take control of where your electricity comes from',
    icon: Check,
  },
  {
    title: 'Boost competition',
    description: 'More choices mean better rates for consumers',
    icon: TrendingUp,
  },
  {
    title: 'Ensure fair switching',
    description: 'Transparent process with no hidden fees',
    icon: Shield,
  },
  {
    title: 'Protect consumer rights',
    description: 'ERC-regulated process ensures your protection',
    icon: Users,
  },
  {
    title: 'Embrace new technology',
    description: 'Access to solar, battery, and smart energy',
    icon: Zap,
  },
  {
    title: 'Save on energy costs',
    description: 'Immediate savings of 7-12% on your bills',
    icon: FileCheck,
  },
];

const faqs = [
  {
    question: 'How long does the switching process take?',
    answer: 'The typical switching process takes 30-60 days from application to activation, depending on your current utility provider and location.',
  },
  {
    question: 'Will there be any interruption to my power supply?',
    answer: 'No. The switching process is seamless and there will be no interruption to your electricity supply at any point.',
  },
  {
    question: 'What are the eligibility requirements?',
    answer: 'You need to meet the ERC\'s Retail Aggregation Program requirements, which typically includes a minimum monthly consumption threshold. Our team will assess your eligibility during the initial consultation.',
  },
  {
    question: 'Are there any upfront costs?',
    answer: 'No upfront costs are required to switch to SunShare for electricity aggregation. You simply start paying lower rates once the switch is complete.',
  },
  {
    question: 'Can I add solar later?',
    answer: 'Yes! After switching, SunShare can help you assess your rooftop for solar potential and guide you through adding solar panels and battery storage for even greater savings.',
  },
];

export default function HowItWorksPage() {
  return (
    <>
      {/* Hero Section - Dark */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden bg-grid-pattern">
        <div className="absolute inset-0 bg-gradient-to-b from-sunshare-deep via-sunshare-deep to-sunshare-navy/30" />
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-sunshare-lime/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-radiant-teal/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl relative z-10 py-24 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <motion.p {...fadeInUp} className="kicker mb-4">
              How It Works
            </motion.p>
            <motion.h1 
              {...fadeInUp}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="h1 text-white mb-6"
            >
              Take Control of Your Electricity,{' '}
              <span className="text-gradient">the Easy Way</span>
            </motion.h1>
            <motion.p 
              {...fadeInUp}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="body-large"
            >
              Filipinos now have the power to choose where their electricity comes from—thanks 
              to the government&apos;s Competitive Retail Electricity Market and Retail Aggregation 
              Program. SunShare makes that choice easy, transparent, and fair.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Benefits Bar - Light */}
      <Section theme="light" className="py-8 md:py-12">
        <motion.div 
          {...fadeInUp}
          className="flex flex-wrap justify-center gap-4 md:gap-6"
        >
          {benefits.slice(0, 5).map((benefit, index) => (
            <motion.div 
              key={benefit.title} 
              className="flex items-center gap-2"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div className="w-5 h-5 rounded-full bg-sunshare-navy/20 flex items-center justify-center">
                <Check className="w-3 h-3 text-sunshare-navy" />
              </div>
              <span className="text-sunshare-deep text-sm">{benefit.title}</span>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* Steps Detail - Dark with Images */}
      <Section theme="dark" background="gradient">
        <SectionHeader
          kicker="Simple 3-Step Process"
          title="Your Journey to Lower Energy Costs"
          subtitle="We've simplified the process of switching to a better energy supplier. Here's how it works."
        />
        <div className="space-y-12 lg:space-y-16">
          {steps.map((step, index) => (
            <motion.div 
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
            >
              <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-sunshare-lime flex items-center justify-center">
                    <span className="text-sunshare-deep font-bold text-lg">{step.step}</span>
                  </div>
                  <div>
                    <h3 className="h3 text-white">{step.title}</h3>
                  </div>
                </div>
                <p className="body-text mb-6">{step.description}</p>
                <div className="space-y-3">
                  {step.details.map((detail, detailIndex) => (
                    <motion.div 
                      key={detail} 
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.3 + detailIndex * 0.1 }}
                    >
                      <div className="w-5 h-5 rounded-full bg-sunshare-lime/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-sunshare-lime" />
                      </div>
                      <span className="text-white/80">{detail}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              {/* Image Card */}
              <div className={`relative ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                  <img 
                    src={step.image} 
                    alt={step.imageAlt}
                    className="w-full h-64 lg:h-80 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-sunshare-deep/60 via-transparent to-transparent" />
                  
                  {/* Step number overlay */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-sunshare-lime flex items-center justify-center">
                      <span className="text-sunshare-deep font-bold">{step.step}</span>
                    </div>
                    <span className="text-white font-medium text-sm">Step {step.step} of 3</span>
                  </div>
                </div>
                
                {/* Decorative accent */}
                <div className="absolute -bottom-3 -right-3 w-full h-full border-2 border-sunshare-lime/20 rounded-2xl -z-10" />
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Benefits Detail - Light - 6 tiles for symmetry */}
      <Section theme="light">
        <SectionHeader
          kicker="Why This Matters"
          title="Benefits of Choosing Your Supplier"
          subtitle="The Retail Aggregation Program opens up new possibilities for Filipino energy consumers."
          theme="light"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <Card theme="light" className="p-6 h-full">
                <div className="w-10 h-10 rounded-lg bg-sunshare-navy/10 flex items-center justify-center mb-4">
                  <benefit.icon className="w-5 h-5 text-sunshare-navy" />
                </div>
                <h4 className="font-semibold text-sunshare-deep mb-2">{benefit.title}</h4>
                <p className="text-sunshare-gray text-sm">{benefit.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* FAQ - Dark */}
      <Section theme="dark" background="gradient">
        <SectionHeader
          kicker="Frequently Asked Questions"
          title="Got Questions? We've Got Answers"
        />
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.question}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-radiant-teal/10 flex items-center justify-center flex-shrink-0">
                    <HelpCircle className="w-4 h-4 text-radiant-teal" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">{faq.question}</h4>
                    <p className="body-text">{faq.answer}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* CTA - Light with improved contrast */}
      <Section theme="light">
        <motion.div {...fadeInUp}>
          <div className="relative overflow-hidden rounded-2xl bg-white p-8 md:p-12 text-center border-2 border-sunshare-navy/20 shadow-lg">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-sunshare-navy/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-radiant-teal/5 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <h2 className="h2 text-sunshare-deep mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-lg text-sunshare-gray max-w-2xl mx-auto mb-8">
                Join Filipino communities who are taking control of their electricity bills 
                with SunShare. The process is simple, and we&apos;re here to help every step of the way.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button href="https://studio--sunshare-registration-portal.us-central1.hosted.app/signup-member" external comingSoon>
                  Start Your Assessment
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button href="/contact" variant="outline-dark">
                  Talk to Our Team
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </Section>
    </>
  );
}
