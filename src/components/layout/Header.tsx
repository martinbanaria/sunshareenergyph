'use client';

import { useState, useEffect, useCallback } from 'react';
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
  const [isOverLightSection, setIsOverLightSection] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Enhanced detection for light vs dark sections
  const checkBackground = useCallback(() => {
    const scrollY = window.scrollY;
    setIsScrolled(scrollY > 10);
    
    // Header detection point (middle of header area)
    const headerDetectionPoint = 40;
    
    // Find all sections on the page
    const sections = document.querySelectorAll('section');
    let isLight = false;
    
    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      
      // Check if our detection point is within this section
      if (rect.top <= headerDetectionPoint && rect.bottom > headerDetectionPoint) {
        // Check multiple ways a section might be "light"
        const classList = section.classList;
        const hasLightTheme = 
          classList.contains('section-light') ||
          classList.contains('bg-sunshare-cream') ||
          section.getAttribute('data-theme') === 'light';
        
        // Also check parent elements for the Section component's theme
        const parentWithTheme = section.closest('[data-theme="light"]');
        
        if (hasLightTheme || parentWithTheme) {
          isLight = true;
        }
      }
    });
    
    // Also check div containers that might have the section-light class
    const lightContainers = document.querySelectorAll('.section-light');
    lightContainers.forEach((container) => {
      const rect = container.getBoundingClientRect();
      if (rect.top <= headerDetectionPoint && rect.bottom > headerDetectionPoint) {
        isLight = true;
      }
    });
    
    setIsOverLightSection(isLight);
  }, []);

  useEffect(() => {
    // Initial check
    checkBackground();
    
    // Check on scroll with throttling for performance
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          checkBackground();
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', checkBackground, { passive: true });
    
    // Re-check after a short delay for route changes (DOM needs to update)
    const timer = setTimeout(checkBackground, 150);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', checkBackground);
      clearTimeout(timer);
    };
  }, [pathname, checkBackground]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const isActiveLink = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    if (pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Dynamic styles based on background - don't change when mobile menu is open
  const shouldUseLightStyles = isOverLightSection && !mobileMenuOpen;
  
  const textColor = shouldUseLightStyles
    ? 'text-sunshare-deep' 
    : 'text-white';
  const textColorMuted = shouldUseLightStyles
    ? 'text-sunshare-deep/70 hover:text-sunshare-deep' 
    : 'text-white/80 hover:text-white';
  const hoverBg = shouldUseLightStyles
    ? 'hover:bg-sunshare-deep/5' 
    : 'hover:bg-white/5';
  const headerBg = shouldUseLightStyles
    ? 'bg-sunshare-cream/95 backdrop-blur-xl border-b border-sunshare-deep/10 shadow-sm'
    : 'bg-sunshare-deep/90 backdrop-blur-xl border-b border-white/5';
  const logoSrc = shouldUseLightStyles
    ? '/brand/logos/sunshare-pulsegrid-light.png'
    : '/brand/logos/sunshare-pulsegrid-dark.png';
  const activeIndicatorColor = shouldUseLightStyles
    ? 'bg-sunshare-navy'
    : 'bg-sunshare-lime';
  const mobileMenuButtonColor = shouldUseLightStyles
    ? 'text-sunshare-deep hover:bg-sunshare-deep/10'
    : 'text-white hover:bg-white/10';

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <motion.div 
        className={`transition-all duration-300 ease-out ${headerBg}`}
        initial={false}
      >
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0" onClick={handleLogoClick}>
              <Image
                src={logoSrc}
                alt="SunShare Philippines"
                width={160}
                height={36}
                className="h-9 md:h-10 w-auto transition-opacity duration-300"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 text-sm transition-colors duration-200 rounded-lg ${hoverBg} ${
                    isActiveLink(link.href) 
                      ? `${textColor} font-medium` 
                      : textColorMuted
                  }`}
                >
                  {link.label}
                  {isActiveLink(link.href) && (
                    <motion.div
                      layoutId="activeTab"
                      className={`absolute bottom-0 left-2 right-2 h-0.5 ${activeIndicatorColor} rounded-full`}
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
                  className={`flex items-center gap-1 px-4 py-2 text-sm transition-colors duration-200 rounded-lg ${hoverBg} ${textColorMuted}`}
                  aria-haspopup="true"
                  aria-expanded={loginDropdownOpen}
                >
                  Login
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${loginDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {loginDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-56 bg-sunshare-deep border border-white/10 rounded-xl overflow-hidden shadow-xl"
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
              <Button 
                href={SIGNUP_URL} 
                external 
                size="sm" 
                comingSoon
              >
                Join Us
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-3 rounded-lg transition-colors duration-200 ${mobileMenuButtonColor}`}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Mobile Menu - Always dark theme for consistency */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-sunshare-deep border-t border-white/10"
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
