import Link from 'next/link';
import Image from 'next/image';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Solutions', href: '/solutions' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Contact', href: '/contact' },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-sunshare-deep border-t border-white/10">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
        {/* Main Footer Content */}
        <div className="py-12 md:py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Logo and Address */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <Image
                src="/brand/logos/sunshare-pulsegrid-dark.png"
                alt="SunShare Philippines"
                width={180}
                height={40}
                className="h-10 w-auto"
              />
            </Link>
            <div className="body-text space-y-2 mb-6">
              <p>Suite 1504, Tektite East Tower</p>
              <p>Exchange Road, Ortigas Center</p>
              <p>Pasig City, Philippines 1605</p>
            </div>
            <div className="body-text space-y-1">
              <p>Phone: <a href="tel:+6386359756" className="hover:text-white transition-colors">+63 8635 9756</a></p>
              <p>Email: <a href="mailto:hello@sunshare.ph" className="hover:text-white transition-colors">hello@sunshare.ph</a></p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="body-text hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/70">
            Copyright © {currentYear} Sunshare Philippines Inc - All Rights Reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-white/70">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
