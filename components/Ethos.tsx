'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { SectionHeader } from './SectionHeader';
import { fadeInUp } from './motionPresets';

export function Ethos() {
  return (
    <section
      id="ethos"
      className="min-h-screen flex items-center justify-center py-20 px-6 bg-slate-950 bg-etched"
    >
      <div className="max-w-6xl w-full">
        <SectionHeader
          eyebrow="Investment Ethos"
          title="Engineered for Place, Culture & Future"
          description="Nexus Group bridges the digital and physical worlds through strategic investments that blend cultural heritage with emerging technologies."
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          {/* Left side - Visual */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative h-96 md:h-full min-h-96 rounded-lg glass-subtle overflow-hidden flex items-center justify-center"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Emblem watermark */}
              <div className="absolute inset-6 opacity-15 mix-blend-soft-light">
                <Image
                  src="/emblem.png"
                  alt="Nexus Group emblem watermark"
                  fill
                  sizes="(min-width: 768px) 480px, 320px"
                  className="object-contain"
                />
              </div>

              {/* Animated grid background */}
              <svg className="absolute inset-0 w-full h-full opacity-20">
                <defs>
                  <pattern id="ethos-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#ethos-grid)" />
              </svg>

              {/* Orbital animation communicating the three focus areas */}
              <motion.div
                animate={useReducedMotion() ? undefined : { rotate: 360 }}
                transition={
                  useReducedMotion()
                    ? undefined
                    : { duration: 40, repeat: Infinity, ease: 'linear' }
                }
                className="relative w-72 h-72"
              >
                <div className="absolute inset-0 gradient-tech rounded-full opacity-25 blur-3xl" />
                <div className="absolute inset-10 border border-blue-600/35 rounded-full" />
                <div className="absolute inset-16 border border-emerald-500/25 rounded-full" />
                <div className="absolute inset-22 border border-amber-500/20 rounded-full" />

                {/* Core */}
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="absolute inset-24 rounded-full bg-slate-950/80 border border-slate-600/80 flex flex-col items-center justify-center text-center px-4"
                >
                  <span className="text-[0.65rem] tracking-[0.18em] uppercase text-slate-400 mb-1">
                    Nexus Group
                  </span>
                  <span className="text-sm font-semibold text-slate-100">
                    Place · Culture · Future
                  </span>
                </motion.div>

                {/* AI & Software */}
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.4 }}
                  className="absolute -top-2 left-1/2 -translate-x-1/2"
                >
                  <div className="px-3 py-2 rounded-full bg-slate-900/95 border border-blue-500/40 shadow-[0_0_25px_rgba(59,130,246,0.4)]">
                    <p className="text-[0.7rem] font-semibold tracking-wide text-blue-300">
                      AI & Software
                    </p>
                    <p className="text-[0.6rem] text-slate-400">Agentic tools & SaaS platforms</p>
                  </div>
                </motion.div>

                {/* Smart Habitats */}
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.5 }}
                  className="absolute top-1/2 -left-3 -translate-y-1/2"
                >
                  <div className="px-3 py-2 rounded-full bg-slate-900/95 border border-emerald-500/40 shadow-[0_0_25px_rgba(16,185,129,0.35)]">
                    <p className="text-[0.7rem] font-semibold tracking-wide text-emerald-300">
                      Smart Habitats
                    </p>
                    <p className="text-[0.6rem] text-slate-400">Off-grid, adaptive living systems</p>
                  </div>
                </motion.div>

                {/* Physical Engineering */}
                <motion.div
                  initial={{ opacity: 0, x: 8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.6 }}
                  className="absolute top-1/2 -right-3 -translate-y-1/2"
                >
                  <div className="px-3 py-2 rounded-full bg-slate-900/95 border border-amber-500/40 shadow-[0_0_25px_rgba(245,158,11,0.35)]">
                    <p className="text-[0.7rem] font-semibold tracking-wide text-amber-200">
                      Physical Engineering
                    </p>
                    <p className="text-[0.6rem] text-slate-400">Vehicles, hardware & fabrication</p>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right side - Content */}
          <motion.div
            variants={fadeInUp()}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-8"
          >
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp(12)}
              className="space-y-4"
            >
              <motion.p
                variants={fadeInUp(12)}
                className="text-lg text-slate-400 leading-relaxed"
              >
                From AI-powered software platforms to intelligent habitats and precision
                engineering, our portfolio reflects a commitment to building ventures that
                matter—ventures that respect what came before while building what comes next.
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2"
            >
              {[
                {
                  label: 'Ventures in motion',
                  value: '6',
                  tone: 'AI, habitats & engineering',
                },
                {
                  label: 'Focus areas',
                  value: '3',
                  tone: 'Intentionally narrow, deeply explored',
                },
                {
                  label: 'Global perspective',
                  value: '100%',
                  tone: 'Rooted in Kenya, built for the world',
                },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="p-4 glass rounded-lg"
                >
                  <div className="text-2xl font-bold text-blue-400">{stat.value}</div>
                  <div className="text-sm text-slate-300 mt-1">{stat.label}</div>
                  <div className="text-xs text-slate-500 mt-1">{stat.tone}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
