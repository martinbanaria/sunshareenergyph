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
    details: ['[Phone Placeholder]'],
  },
  {
    icon: Mail,
    title: 'Email Us',
    details: ['[Email Placeholder]'],
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
      {/* Hero Section with Contact Info Cards */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden bg-grid-pattern">
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

          {/* Contact Info Cards - Moved up directly under hero text */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              >
                <Card className="p-4 md:p-6 text-center h-full">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-sunshare-lime/10 flex items-center justify-center mx-auto mb-3">
                    <info.icon className="w-5 h-5 md:w-6 md:h-6 text-sunshare-lime" />
                  </div>
                  <h3 className="font-semibold text-white text-sm md:text-base mb-1">{info.title}</h3>
                  {info.details.map((detail, detailIndex) => (
                    <p key={detailIndex} className="body-text text-xs md:text-sm">{detail}</p>
                  ))}
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map Section */}
      <Section className="pt-8 md:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Form */}
          <motion.div {...fadeInUp}>
            <h2 className="h2 text-white mb-4">Send Us a Message</h2>
            <p className="body-text mb-6">
              Fill out the form below and our team will get back to you as soon as possible.
            </p>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-sunshare-lime/20 flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-sunshare-lime" />
                  </div>
                  <h3 className="h3 text-white mb-2">Message Sent!</h3>
                  <p className="body-text">
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
                    <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-sunshare-lime/50 transition-colors"
                      placeholder="Juan Dela Cruz"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  >
                    <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-sunshare-lime/50 transition-colors"
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
                    <label htmlFor="phone" className="block text-sm font-medium text-white mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-sunshare-lime/50 transition-colors"
                      placeholder="+63 912 345 6789"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                  >
                    <label htmlFor="subject" className="block text-sm font-medium text-white mb-2">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-sunshare-lime/50 transition-colors"
                    >
                      <option value="" className="bg-sunshare-deep">Select a topic</option>
                      <option value="general" className="bg-sunshare-deep">General Inquiry</option>
                      <option value="residential" className="bg-sunshare-deep">Residential Customer</option>
                      <option value="commercial" className="bg-sunshare-deep">Commercial/Business</option>
                      <option value="partnership" className="bg-sunshare-deep">Partnership Opportunity</option>
                      <option value="support" className="bg-sunshare-deep">Customer Support</option>
                    </select>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                >
                  <label htmlFor="message" className="block text-sm font-medium text-white mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-sunshare-lime/50 transition-colors resize-none"
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
              <h2 className="h2 text-white mb-4">Find Us</h2>
              <Card className="p-4 h-56 lg:h-64 overflow-hidden">
                {/* Map placeholder */}
                <div className="w-full h-full bg-sunshare-navy/30 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-10 h-10 text-sunshare-lime/50 mx-auto mb-2" />
                    <p className="body-text">Tektite East Tower</p>
                    <p className="text-sm text-white/60">Ortigas Center, Pasig City</p>
                  </div>
                </div>
              </Card>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="p-5">
                <h4 className="font-semibold text-white mb-2">Looking to join our team?</h4>
                <p className="body-text text-sm mb-4">
                  We&apos;re always looking for talented individuals who share our passion for 
                  clean energy and sustainable solutions.
                </p>
                <Button href="mailto:careers@sunshareenergy.ph" variant="outline" size="sm">
                  View Opportunities
                </Button>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </Section>

      {/* CTA */}
      <Section background="gradient" className="mt-8">
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
