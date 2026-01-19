'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 }
};

const contactInfo = [
  {
    icon: MapPin,
    title: 'Visit Us',
    details: ['Suite 1504, Tektite East Tower', 'Exchange Road, Ortigas Center', 'Pasig City, Philippines 1605'],
  },
  {
    icon: Phone,
    title: 'Call Us',
    details: ['+63 8635 9756'],
  },
  {
    icon: Mail,
    title: 'Email Us',
    details: ['hello@sunshare.ph'],
  },
  {
    icon: Clock,
    title: 'Business Hours',
    details: ['Monday - Friday', '9:00 AM - 6:00 PM'],
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setSubmitted(true);
  };

  return (
    <>
      {/* Hero Section with Contact Info Cards - Dark */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden bg-grid-pattern">
        <div className="absolute inset-0 bg-gradient-to-b from-sunshare-deep via-sunshare-deep to-sunshare-navy/30" />
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-sunshare-lime/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-radiant-teal/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl relative z-10 py-24 md:py-32">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <motion.p {...fadeInUp} className="kicker mb-4">
              Contact Us
            </motion.p>
            <motion.h1 
              {...fadeInUp}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="h1 text-white mb-6"
            >
              Let&apos;s Start a Conversation
            </motion.h1>
            <motion.p 
              {...fadeInUp}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="body-large"
            >
              Have questions about our energy solutions? Want to learn how SunShare 
              can help your community or business save on electricity? We&apos;re here to help.
            </motion.p>
          </div>

          {/* Contact Info Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="h-full"
              >
                <Card className="p-5 md:p-7 text-left h-full relative overflow-hidden group hover:border-sunshare-lime/30 transition-all duration-300">
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-sunshare-lime/0 via-sunshare-lime/0 to-sunshare-lime/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative z-10">
                    {/* Icon with gradient background */}
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-sunshare-lime/20 to-radiant-teal/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <info.icon className="w-7 h-7 md:w-8 md:h-8 text-sunshare-lime" strokeWidth={1.5} />
                    </div>
                    
                    {/* Title with accent */}
                    <h3 className="font-bold text-white text-base md:text-lg mb-3 flex items-center gap-2">
                      {info.title}
                      <div className="h-px flex-1 bg-gradient-to-r from-sunshare-lime/30 to-transparent" />
                    </h3>
                    
                    {/* Details with better spacing */}
                    <div className="space-y-1">
                      {info.details.map((detail, detailIndex) => (
                        <p key={detailIndex} className="text-white/80 text-sm md:text-base leading-relaxed">
                          {detail}
                        </p>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map Section - Light */}
      <Section theme="light" className="pt-12 md:pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Form */}
          <motion.div {...fadeInUp}>
            <h2 className="h2 text-sunshare-deep mb-4">Send Us a Message</h2>
            <p className="text-sunshare-gray mb-6">
              Fill out the form below and our team will get back to you as soon as possible.
            </p>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <Card theme="light" className="p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-sunshare-navy/10 flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-sunshare-navy" />
                  </div>
                  <h3 className="h3 text-sunshare-deep mb-2">Message Sent!</h3>
                  <p className="text-sunshare-gray">
                    Thank you for reaching out. Our team will review your message and 
                    get back to you shortly.
                  </p>
                </Card>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  >
                    <label htmlFor="name" className="block text-sm font-medium text-sunshare-deep mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white border border-sunshare-deep/20 rounded-xl text-sunshare-deep placeholder-sunshare-gray/50 focus:outline-none focus:border-sunshare-navy focus:ring-1 focus:ring-sunshare-navy/20 transition-colors"
                      placeholder="Juan Dela Cruz"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  >
                    <label htmlFor="email" className="block text-sm font-medium text-sunshare-deep mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white border border-sunshare-deep/20 rounded-xl text-sunshare-deep placeholder-sunshare-gray/50 focus:outline-none focus:border-sunshare-navy focus:ring-1 focus:ring-sunshare-navy/20 transition-colors"
                      placeholder="juan@example.com"
                    />
                  </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                  >
                    <label htmlFor="phone" className="block text-sm font-medium text-sunshare-deep mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white border border-sunshare-deep/20 rounded-xl text-sunshare-deep placeholder-sunshare-gray/50 focus:outline-none focus:border-sunshare-navy focus:ring-1 focus:ring-sunshare-navy/20 transition-colors"
                      placeholder="+63 912 345 6789"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                  >
                    <label htmlFor="subject" className="block text-sm font-medium text-sunshare-deep mb-2">
                      Subject *
                    </label>
                    <div className="relative">
                      <select
                        id="subject"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 pr-10 bg-white border border-sunshare-deep/20 rounded-xl text-sunshare-deep focus:outline-none focus:border-sunshare-navy focus:ring-1 focus:ring-sunshare-navy/20 transition-colors appearance-none"
                      >
                        <option value="">Select a topic</option>
                        <option value="general">General Inquiry</option>
                        <option value="residential">Residential Customer</option>
                        <option value="commercial">Commercial/Business</option>
                        <option value="partnership">Partnership Opportunity</option>
                        <option value="support">Customer Support</option>
                      </select>
                      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-sunshare-deep/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                >
                  <label htmlFor="message" className="block text-sm font-medium text-sunshare-deep mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-sunshare-deep/20 rounded-xl text-sunshare-deep placeholder-sunshare-gray/50 focus:outline-none focus:border-sunshare-navy focus:ring-1 focus:ring-sunshare-navy/20 transition-colors resize-none"
                    placeholder="Tell us how we can help..."
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                >
                  <Button type="submit" loading={isSubmitting} className="w-full md:w-auto">
                    Send Message
                    <Send className="ml-2 w-4 h-4" />
                  </Button>
                </motion.div>
              </form>
            )}
          </motion.div>

          {/* Map and Additional Info */}
          <motion.div 
            {...fadeInUp}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            <div>
              <h2 className="h2 text-sunshare-deep mb-4">Find Us</h2>
              <Card theme="light" className="p-0 h-[400px] lg:h-[450px] overflow-hidden">
                {/* Google Maps Embed */}
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.3168794473547!2d121.05550507585968!3d14.586281285899018!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c839a1168fe9%3A0xb346f85d2fdfe802!2sTektite%20Tower%20East!5e0!3m2!1sen!2sph!4v1705634000000!5m2!1sen!2sph"
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }}
                  allowFullScreen 
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Tektite East Tower Location Map"
                  className="rounded-lg"
                />
              </Card>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card theme="light" className="p-5">
                <h4 className="font-semibold text-sunshare-deep mb-2">Looking to join our team?</h4>
                <p className="text-sunshare-gray text-sm mb-4">
                  We&apos;re always looking for talented individuals who share our passion for 
                  clean energy and sustainable solutions.
                </p>
                <Button href="mailto:hello@sunshare.ph" variant="outline-dark" size="sm">
                  View Opportunities
                </Button>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </Section>

      {/* CTA - Dark */}
      <Section theme="dark" background="gradient" className="mt-8">
        <motion.div {...fadeInUp} className="text-center">
          <h2 className="h2 text-white mb-4">
            Ready to Start Saving?
          </h2>
          <p className="body-large max-w-2xl mx-auto mb-8">
            Don&apos;t wait to take control of your energy costs. Join SunShare today and 
            start your journey toward smarter, cheaper, and cleaner energy.
          </p>
          <Button href="https://studio--sunshare-registration-portal.us-central1.hosted.app/signup-member" external size="lg" comingSoon>
            Get a Free Assessment
          </Button>
        </motion.div>
      </Section>
    </>
  );
}
