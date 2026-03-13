'use client';

import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter } from 'lucide-react';
import Image from 'next/image';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { label: 'About', href: '#ethos' },
    { label: 'Portfolio', href: '#ventures' },
    { label: 'Shop', href: '/shop' },
    { label: 'Contact', href: '#contact' },
  ];

  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Github, href: '#', label: 'GitHub' },
  ];

  return (
    <footer className="border-t border-slate-700/50 bg-slate-950 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8 mb-8"
        >
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border border-slate-600/50">
                <Image
                  src="/emblem.png"
                  alt="Nexus Group"
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-semibold text-slate-100 tracking-[0.16em] uppercase text-xs">
                Nexus Group
              </span>
            </div>
            <p className="text-slate-400 text-sm">
              Engineering the Future. Grounded in Heritage.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-slate-100 mb-4">Navigation</h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-blue-400 transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold text-slate-100 mb-4">Connect</h4>
            <div className="flex gap-4">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    whileHover={{ scale: 1.2, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-slate-400 hover:text-blue-400 transition-colors"
                    aria-label={link.label}
                  >
                    <Icon size={20} />
                  </motion.a>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent mb-8"
        ></motion.div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center text-slate-500 text-sm"
        >
          <p>© {currentYear} Nexus Group. All rights reserved. | Engineered for the future.</p>
        </motion.div>
      </div>
    </footer>
  );
}
