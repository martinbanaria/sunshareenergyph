import { Metadata } from 'next';
import { Section, SectionHeader } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Zap, Sun, Cpu, Building2, Users, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about SunShare Philippines Inc., our mission to transform energy for Filipino communities, and our three core business lines.',
};

const businessLines = [
  {
    icon: Zap,
    title: 'SunShare Gen',
    subtitle: 'Generation Development',
    description: 'We originate and develop power generation projects, building a robust pipeline of rooftop solar and solar farm projects across the Philippines.',
  },
  {
    icon: Sun,
    title: 'SunShare RES',
    subtitle: 'Retail Electricity Supplier',
    description: 'As a licensed retail electricity supplier, we provide residential and commercial customers with access to cleaner, cheaper energy through demand aggregation.',
  },
  {
    icon: Cpu,
    title: 'SunShare Digital',
    subtitle: 'Digital Infrastructure',
    description: 'Our blockchain-powered platform enables energy tracking, trading, certification, and embedded services for transparent and verifiable clean energy.',
  },
];

const values = [
  {
    icon: Users,
    title: 'Community First',
    description: 'We believe in empowering Filipino communities with energy solutions that make a real difference in their daily lives.',
  },
  {
    icon: Shield,
    title: 'Trust & Transparency',
    description: 'Every kilowatt-hour is tracked and verified, ensuring our customers know exactly where their energy comes from.',
  },
  {
    icon: Building2,
    title: 'Regulatory Compliance',
    description: 'We work closely with DOE, ERC, and other regulatory bodies to ensure full compliance with Philippine energy regulations.',
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <Section className="pt-24 md:pt-32">
        <div className="max-w-4xl mx-auto text-center">
          <p className="kicker mb-4">About SunShare Philippines</p>
          <h1 className="h1 text-white mb-6">
            Transforming the Way Filipino Communities Experience Energy
          </h1>
          <p className="body-large">
            SunShare Philippines Inc. is a next-generation energy company committed to 
            making clean, affordable, and reliable energy accessible to every Filipino 
            home and business.
          </p>
        </div>
      </Section>

      {/* Mission & Vision */}
      <Section background="gradient">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-8">
            <p className="kicker text-sunshare-lime mb-4">Our Mission</p>
            <h2 className="h3 text-white mb-4">
              Empowering Energy Independence
            </h2>
            <p className="body-text">
              To provide Filipino communities and businesses with smarter, cheaper, 
              and cleaner energy solutions that reduce costs, increase reliability, 
              and contribute to a sustainable future.
            </p>
          </Card>
          <Card className="p-8">
            <p className="kicker text-radiant-teal mb-4">Our Vision</p>
            <h2 className="h3 text-white mb-4">
              A Clean Energy Philippines
            </h2>
            <p className="body-text">
              To be the leading energy transition platform in the Philippines, 
              turning every rooftop into a bankable climate asset and making 
              clean energy the default choice for all Filipinos.
            </p>
          </Card>
        </div>
      </Section>

      {/* Company Story */}
      <Section>
        <div className="max-w-4xl mx-auto">
          <SectionHeader
            kicker="Our Story"
            title="Building a Brighter Energy Future"
          />
          <div className="space-y-6 body-text">
            <p>
              Across the Philippines, families, condos, offices, buildings, and small 
              businesses all face the same challenge: electricity that keeps getting 
              more expensive, less reliable, and harder to manage.
            </p>
            <p>
              SunShare was founded to change that. We bring communities and enterprises 
              a smarter, cleaner, and more affordable way to power everyday life and 
              operations. We make the shift simple.
            </p>
            <p>
              SunShare helps you lower your electricity costs right away and guides you 
              toward even bigger savings through rooftop solar and battery storage. From 
              switching, to rooftop assessment, to choosing the right solar or battery 
              plan with subscription or financing options, we support you at every step 
              of the journey.
            </p>
            <p>
              This is not just about cutting costs. It is about giving Filipinos more 
              control, more reliability during outages, and more confidence in a cleaner 
              future. Together, we can turn rooftops into opportunities, reduce the 
              burden of monthly bills, and build stronger, greener communities.
            </p>
          </div>
        </div>
      </Section>

      {/* Business Lines */}
      <Section background="gradient">
        <SectionHeader
          kicker="Our Business"
          title="Three Pillars of Energy Transformation"
          subtitle="SunShare operates through three integrated business lines that work together to deliver comprehensive energy solutions."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {businessLines.map((line) => (
            <Card key={line.title} className="p-6">
              <div className="w-12 h-12 rounded-xl bg-sunshare-lime/10 flex items-center justify-center mb-4">
                <line.icon className="w-6 h-6 text-sunshare-lime" />
              </div>
              <h3 className="h3 text-white mb-1">{line.title}</h3>
              <p className="text-sm text-sunshare-lime mb-3">{line.subtitle}</p>
              <p className="body-text">{line.description}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* Values */}
      <Section>
        <SectionHeader
          kicker="Our Values"
          title="What Drives Us"
          subtitle="Our core values guide everything we do as we work to transform energy in the Philippines."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {values.map((value) => (
            <Card key={value.title} className="p-6">
              <div className="w-12 h-12 rounded-xl bg-radiant-teal/10 flex items-center justify-center mb-4">
                <value.icon className="w-6 h-6 text-radiant-teal" />
              </div>
              <h3 className="h3 text-white mb-3">{value.title}</h3>
              <p className="body-text">{value.description}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* Regulatory Compliance */}
      <Section background="gradient">
        <div className="max-w-3xl mx-auto text-center">
          <p className="kicker mb-4">Regulatory Compliance</p>
          <h2 className="h2 text-white mb-6">
            Committed to Philippine Energy Standards
          </h2>
          <p className="body-large mb-8">
            SunShare Philippines Inc. operates in full compliance with the regulations 
            set forth by the Department of Energy (DOE), Energy Regulatory Commission (ERC), 
            and other relevant government agencies. We are committed to transparency, 
            consumer protection, and the advancement of the Philippine energy sector.
          </p>
          <Button href="/contact" variant="outline">
            Contact Us for More Information
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <Card className="p-8 md:p-12 text-center">
          <h2 className="h2 text-white mb-4">
            Ready to Join the Energy Revolution?
          </h2>
          <p className="body-large max-w-2xl mx-auto mb-8">
            Partner with SunShare and take the first step toward smarter, cheaper, 
            and cleaner energy for your community or business.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button href="https://studio--sunshare-registration-portal.us-central1.hosted.app/signup-member" external>
              Get Started
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
