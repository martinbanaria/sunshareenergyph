import { Metadata } from 'next';
import { Section, SectionHeader } from '@/components/ui/Section';
import { Card, StepCard } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Check, FileCheck, Users, Zap, HelpCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'How It Works',
  description: 'Learn how SunShare makes switching to clean, affordable energy simple with our easy 3-step process.',
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
  },
];

const benefits = [
  {
    title: 'Empower users to choose',
    description: 'Take control of where your electricity comes from',
  },
  {
    title: 'Boost competition',
    description: 'More choices mean better rates for consumers',
  },
  {
    title: 'Ensure fair switching and billing',
    description: 'Transparent process with no hidden fees',
  },
  {
    title: 'Protect consumer rights',
    description: 'ERC-regulated process ensures your protection',
  },
  {
    title: 'Embrace new energy technologies',
    description: 'Access to solar, battery, and smart energy solutions',
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
      {/* Hero Section */}
      <Section className="pt-24 md:pt-32">
        <div className="max-w-4xl mx-auto text-center">
          <p className="kicker mb-4">How It Works</p>
          <h1 className="h1 text-white mb-6">
            Take Control of Your Electricity,{' '}
            <span className="text-gradient">the Easy Way</span>
          </h1>
          <p className="body-large">
            Filipinos now have the power to choose where their electricity comes from—thanks 
            to the government&apos;s Competitive Retail Electricity Market and Retail Aggregation 
            Program. SunShare makes that choice easy, transparent, and fair.
          </p>
        </div>
      </Section>

      {/* Benefits Bar */}
      <Section background="gradient" className="py-8 md:py-12">
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {benefits.slice(0, 5).map((benefit) => (
            <div key={benefit.title} className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-sunshare-lime/20 flex items-center justify-center">
                <Check className="w-3 h-3 text-sunshare-lime" />
              </div>
              <span className="text-white/80 text-sm">{benefit.title}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Steps Detail */}
      <Section>
        <SectionHeader
          kicker="Simple 3-Step Process"
          title="Your Journey to Lower Energy Costs"
          subtitle="We've simplified the process of switching to a better energy supplier. Here's how it works."
        />
        <div className="space-y-12 lg:space-y-16">
          {steps.map((step, index) => (
            <div 
              key={step.step}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
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
                  {step.details.map((detail) => (
                    <div key={detail} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-sunshare-lime/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-sunshare-lime" />
                      </div>
                      <span className="text-white/80">{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Card className={`p-8 flex items-center justify-center ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                <div className="w-24 h-24 rounded-2xl bg-sunshare-lime/10 flex items-center justify-center">
                  <step.icon className="w-12 h-12 text-sunshare-lime" />
                </div>
              </Card>
            </div>
          ))}
        </div>
      </Section>

      {/* Benefits Detail */}
      <Section background="gradient">
        <SectionHeader
          kicker="Why This Matters"
          title="Benefits of Choosing Your Supplier"
          subtitle="The Retail Aggregation Program opens up new possibilities for Filipino energy consumers."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit) => (
            <Card key={benefit.title} className="p-6">
              <div className="w-10 h-10 rounded-lg bg-sunshare-lime/10 flex items-center justify-center mb-4">
                <Check className="w-5 h-5 text-sunshare-lime" />
              </div>
              <h4 className="font-semibold text-white mb-2">{benefit.title}</h4>
              <p className="body-text text-sm">{benefit.description}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section>
        <SectionHeader
          kicker="Frequently Asked Questions"
          title="Got Questions? We've Got Answers"
        />
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq) => (
            <Card key={faq.question} className="p-6">
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
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section background="gradient">
        <Card className="p-8 md:p-12 text-center">
          <h2 className="h2 text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="body-large max-w-2xl mx-auto mb-8">
            Join thousands of Filipinos who are already saving on their electricity bills 
            with SunShare. The process is simple, and we&apos;re here to help every step of the way.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button href="https://studio--sunshare-registration-portal.us-central1.hosted.app/signup-member" external>
              Start Your Assessment
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button href="/contact" variant="secondary">
              Talk to Our Team
            </Button>
          </div>
        </Card>
      </Section>
    </>
  );
}
