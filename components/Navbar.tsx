'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  const navLinks = [
    { id: 'shop', label: 'Shop', href: '/shop' },
    { id: 'ventures', label: 'Ventures', href: '/#ventures' },
    { id: 'ethos', label: 'Ethos', href: '/#ethos' },
    { id: 'contact', label: 'Contact', href: '/#contact' },
  ];

  const handleSectionClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const isHome = pathname === '/';
    const sectionId = href.split('#')[1];

    if (isHome) {
      // On home page, just scroll to section
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Not on home page, navigate home first then scroll
      router.push('/');
      // Scroll after navigation completes
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  useEffect(() => {
    // On the dedicated shop page, highlight Shop and skip scroll tracking.
    if (pathname.startsWith('/shop')) {
      if (activeSection !== 'shop') {
        setActiveSection('shop');
      }
      return;
    }

    const sectionIds = navLinks
      .filter((link) => link.href.startsWith('#'))
      .map((link) => link.id);

    const handleScroll = () => {
      let current: string | null = null;
      let closestOffset = Number.POSITIVE_INFINITY;

      sectionIds.forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;

        const rect = el.getBoundingClientRect();
        const offset = Math.abs(rect.top - 96); // account for navbar height

        if (rect.bottom > 0 && offset < closestOffset) {
          closestOffset = offset;
          current = id;
        }
      });

      if (current !== activeSection) {
        setActiveSection(current);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [activeSection, pathname]);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-slate-700/70 backdrop-saturate-150"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-amber-500/60 bg-slate-900/80 shadow-[0_0_0_1px_rgba(15,23,42,0.9)]">
            <Image
              src="/emblem.png"
              alt="Nexus Group"
              width={40}
              height={40}
              priority
              className="w-full h-full object-cover"
            />
          </div>
          <div className="hidden sm:block">
            <div className="text-slate-100 font-semibold text-sm tracking-[0.18em] uppercase">
              NEXUS GROUP
            </div>
            <div className="text-slate-400 text-[0.65rem] tracking-[0.18em] uppercase">
              Ventures Unified
            </div>
          </div>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            const isShopLink = link.href === '/shop';

            const className = `text-sm font-medium transition-colors pb-1 border-b-2 ${
              isActive
                ? 'text-blue-400 border-blue-400'
                : 'text-slate-300 border-transparent hover:text-blue-400'
            }`;

            if (isShopLink) {
              return (
                <Link key={link.label} href={link.href} className={className}>
                  {link.label}
                </Link>
              );
            }

            return (
              <motion.a
                key={link.label}
                href={link.href}
                onClick={(e) => handleSectionClick(e, link.href)}
                whileHover={{ y: -2 }}
                className={className}
              >
                {link.label}
              </motion.a>
            );
          })}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-slate-300 hover:text-slate-100 transition-colors"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden border-t border-slate-700/50 px-6 py-4 space-y-3 bg-black/30 backdrop-blur-sm"
        >
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            const isShopLink = link.href === '/shop';
            const className = `block text-sm font-medium py-2 transition-colors ${
              isActive ? 'text-blue-400' : 'text-slate-300 hover:text-blue-400'
            }`;

            if (isShopLink) {
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={className}
                >
                  {link.label}
                </Link>
              );
            }

            return (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  handleSectionClick(e, link.href);
                  setIsOpen(false);
                }}
                className={className}
              >
                {link.label}
              </a>
            );
          })}
        </motion.div>
      )}
    </motion.nav>
  );
}
