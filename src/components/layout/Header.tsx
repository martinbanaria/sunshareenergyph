'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Solutions', href: '/solutions' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Contact', href: '/contact' },
];

const loginLinks = [
  { label: 'Customer Portal (Coming Soon)', href: '#' },
  { label: 'RES Portal (Coming Soon)', href: '#' },
  { label: 'SunShare Portal (Coming Soon)', href: '#' },
];

const SIGNUP_URL = 'https://studio--sunshare-registration-portal.us-central1.hosted.app/signup-member';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
  const pathname = usePathname();

  const isActiveLink = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="surface backdrop-blur-xl">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/brand/logos/sunshare-pulsegrid-dark.png"
                alt="SunShare Philippines"
                width={160}
                height={36}
                className="h-9 md:h-10 w-auto"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 text-sm transition-colors rounded-lg hover:bg-white/5 ${
                    isActiveLink(link.href) 
                      ? 'text-white font-medium' 
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  {link.label}
                  {isActiveLink(link.href) && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-sunshare-lime rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Login Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setLoginDropdownOpen(!loginDropdownOpen)}
                  onBlur={() => setTimeout(() => setLoginDropdownOpen(false), 150)}
                  className="flex items-center gap-1 px-4 py-2 text-sm text-white/80 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                  aria-haspopup="true"
                  aria-expanded={loginDropdownOpen}
                >
                  Login
                  <ChevronDown className={`w-4 h-4 transition-transform ${loginDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {loginDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-56 surface rounded-xl overflow-hidden shadow-xl"
                    >
                      {loginLinks.map((link) => (
                        <span
                          key={link.label}
                          className="block px-4 py-3 text-sm text-white/40 cursor-not-allowed"
                        >
                          {link.label}
                        </span>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Join Us Button */}
              <Button href={SIGNUP_URL} external size="sm" comingSoon>
                Join Us
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-3 text-white/80 hover:text-white transition-colors"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden surface border-t border-white/10"
          >
            <div className="container mx-auto px-4 py-4">
              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-lg transition-colors ${
                      isActiveLink(link.href)
                        ? 'text-white bg-sunshare-lime/10 border-l-2 border-sunshare-lime font-medium'
                        : 'text-white/80 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="border-t border-white/10 my-2" />
                <p className="px-4 py-2 text-xs text-white/50 uppercase tracking-wider">Login</p>
                {loginLinks.map((link) => (
                  <span
                    key={link.label}
                    className="px-4 py-3 text-white/40 rounded-lg cursor-not-allowed block"
                  >
                    {link.label}
                  </span>
                ))}
                <div className="border-t border-white/10 my-2" />
                <div className="px-4 py-2">
                  <Button href={SIGNUP_URL} external className="w-full" comingSoon>
                    Join Us
                  </Button>
                </div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Header;
