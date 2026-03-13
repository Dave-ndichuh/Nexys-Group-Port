'use client';

import { motion } from 'framer-motion';
import { ArrowDownRight } from 'lucide-react';
import { fadeInUp, staggerContainer } from './motionPresets';

export function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center pt-20 px-6 bg-slate-950 bg-etched relative overflow-hidden">
      {/* Background gradient orbs - echoing emblem steel & bronze */}
      <div className="pointer-events-none absolute -top-32 -left-10 w-[28rem] h-[28rem] rounded-full bg-gradient-to-br from-cyan-500/15 via-blue-500/10 to-slate-900/0 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-10 w-[30rem] h-[30rem] rounded-full bg-gradient-to-tr from-amber-600/20 via-amber-500/10 to-slate-900/0 blur-3xl" />

      <motion.div
        variants={staggerContainer()}
        initial="hidden"
        animate="visible"
        className="max-w-5xl text-center relative z-10 emblem-halo"
      >
        <motion.div variants={fadeInUp()} className="mb-6">
          <div className="badge-ring mb-8 text-slate-200">
            <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-br from-cyan-400 to-amber-400 shadow-[0_0_12px_rgba(56,189,248,0.9)]" />
            Nexus Group
            <span className="text-slate-400">Ventures Unified</span>
          </div>
        </motion.div>

        <motion.h1
          variants={fadeInUp()}
          className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-balance"
        >
          <span className="gradient-heritage-text">Engineering the Future.</span>
          <br />
          <span className="gradient-tech-text">Grounded in Heritage.</span>
        </motion.h1>

        <motion.p
          variants={fadeInUp()}
          className="text-lg md:text-xl text-slate-400 mb-8 max-w-2xl mx-auto"
        >
          Nexus Group: A multi-sector investment collective that bridges cutting-edge technology with timeless values, spanning AI & SaaS, Smart Habitats, and Physical Engineering.
        </motion.p>

        <motion.div variants={fadeInUp()} className="flex justify-center">
          <motion.a
            href="#ventures"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-8 py-4 gradient-tech text-white font-semibold rounded-full border border-slate-200/20 shadow-[0_18px_45px_rgba(15,23,42,0.9)] hover:shadow-[0_22px_55px_rgba(15,23,42,1)] transition-all"
          >
            Explore Our Ventures
            <ArrowDownRight size={20} />
          </motion.a>
        </motion.div>

        {/* Pillars strip */}
        <motion.div
          variants={fadeInUp(24)}
          className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 text-left"
        >
          {[
            {
              label: 'AI & Software',
              description: 'Agentic SaaS systems, automation, and developer tools.',
              accent: 'from-blue-500/70 to-cyan-400/70',
            },
            {
              label: 'Smart Habitats',
              description: 'Off-grid, adaptive environments for modern coastal living.',
              accent: 'from-emerald-500/70 to-teal-400/70',
            },
            {
              label: 'Physical Engineering',
              description: 'Vehicles, hardware, and fabrication for harsh terrains.',
              accent: 'from-amber-500/80 to-orange-500/80',
            },
          ].map((pillar) => (
            <motion.div
              key={pillar.label}
              whileHover={{ y: -4 }}
              className="rounded-xl border border-slate-700/70 bg-slate-900/70 px-4 py-4 md:px-5 md:py-5 shadow-[0_18px_45px_rgba(15,23,42,0.7)]"
            >
              <div className="flex items-center gap-3 mb-2">
                <span
                  className={`h-8 w-8 rounded-full bg-gradient-to-br ${pillar.accent} flex items-center justify-center shadow-[0_0_18px_rgba(56,189,248,0.5)]`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-950/90" />
                </span>
                <p className="text-xs font-semibold tracking-[0.20em] uppercase text-slate-200">
                  {pillar.label}
                </p>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">{pillar.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
