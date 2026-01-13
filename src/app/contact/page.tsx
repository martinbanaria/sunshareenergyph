'use client';

import { useState } from 'react';
import { Section, SectionHeader } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MapPin, Phone, Mail, Clock, Send, Linkedin, Facebook, Twitter } from 'lucide-react';

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

const socialLinks = [
  { icon: Linkedin, label: 'LinkedIn', href: '#' },
  { icon: Facebook, label: 'Facebook', href: '#' },
  { icon: Twitter, label: 'X (Twitter)', href: '#' },
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
      {/* Hero Section */}
      <Section className="pt-24 md:pt-32">
        <div className="max-w-4xl mx-auto text-center">
          <p className="kicker mb-4">Contact Us</p>
          <h1 className="h1 text-white mb-6">
            Let&apos;s Start a Conversation
          </h1>
          <p className="body-large">
            Have questions about our energy solutions? Want to learn how SunShare 
            can help your community or business save on electricity? We&apos;re here to help.
          </p>
        </div>
      </Section>

      {/* Contact Info Cards */}
      <Section background="gradient" className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactInfo.map((info) => (
            <Card key={info.title} className="p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-sunshare-lime/10 flex items-center justify-center mx-auto mb-4">
                <info.icon className="w-6 h-6 text-sunshare-lime" />
              </div>
              <h3 className="font-semibold text-white mb-2">{info.title}</h3>
              {info.details.map((detail, index) => (
                <p key={index} className="body-text text-sm">{detail}</p>
              ))}
            </Card>
          ))}
        </div>
      </Section>

      {/* Contact Form */}
      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Form */}
          <div>
            <h2 className="h2 text-white mb-6">Send Us a Message</h2>
            <p className="body-text mb-8">
              Fill out the form below and our team will get back to you as soon as possible.
            </p>

            {submitted ? (
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
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
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
                  </div>
                  <div>
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
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
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
                  </div>
                  <div>
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
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-white mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-sunshare-lime/50 transition-colors resize-none"
                    placeholder="Tell us how we can help..."
                  />
                </div>

                <Button type="submit" loading={isSubmitting} className="w-full md:w-auto">
                  Send Message
                  <Send className="ml-2 w-4 h-4" />
                </Button>
              </form>
            )}
          </div>

          {/* Map and Additional Info */}
          <div>
            <h2 className="h2 text-white mb-6">Find Us</h2>
            <Card className="p-4 mb-8 h-64 lg:h-80 overflow-hidden">
              {/* Map placeholder */}
              <div className="w-full h-full bg-sunshare-navy/30 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-sunshare-lime/50 mx-auto mb-2" />
                  <p className="body-text">Tektite East Tower</p>
                  <p className="text-sm text-white/50">Ortigas Center, Pasig City</p>
                </div>
              </div>
            </Card>

            <h3 className="font-semibold text-white mb-4">Connect With Us</h3>
            <div className="flex gap-3 mb-8">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-sunshare-lime/50 transition-colors"
                  aria-label={link.label}
                >
                  <link.icon className="w-5 h-5" />
                </a>
              ))}
            </div>

            <Card className="p-6">
              <h4 className="font-semibold text-white mb-2">Looking to join our team?</h4>
              <p className="body-text text-sm mb-4">
                We&apos;re always looking for talented individuals who share our passion for 
                clean energy and sustainable solutions.
              </p>
              <Button href="mailto:careers@sunshareenergy.ph" variant="outline" size="sm">
                View Opportunities
              </Button>
            </Card>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section background="gradient">
        <div className="text-center">
          <h2 className="h2 text-white mb-4">
            Ready to Start Saving?
          </h2>
          <p className="body-large max-w-2xl mx-auto mb-8">
            Don&apos;t wait to take control of your energy costs. Join SunShare today and 
            start your journey toward smarter, cheaper, and cleaner energy.
          </p>
          <Button href="https://studio--sunshare-registration-portal.us-central1.hosted.app/signup-member" external size="lg">
            Get a Free Assessment
          </Button>
        </div>
      </Section>
    </>
  );
}
