import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { Solutions } from '@/components/sections/Solutions';
import { WhyUs } from '@/components/sections/WhyUs';
import { Testimonials } from '@/components/sections/Testimonials';
import { CTA } from '@/components/sections/CTA';

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <HowItWorks />
      <Solutions />
      <WhyUs />
      <Testimonials />
      <CTA />
    </>
  );
}
