'use client';

import { motion } from 'framer-motion';
import { fadeInUp } from './motionPresets';

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
}

export function SectionHeader({ eyebrow, title, description, align = 'left' }: SectionHeaderProps) {
  const alignment =
    align === 'center'
      ? 'text-center items-center mx-auto'
      : 'text-left items-start';

  return (
    <motion.div
      variants={fadeInUp()}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={`flex flex-col gap-3 mb-10 ${alignment}`}
    >
      <div className="badge-ring text-slate-200">
        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(56,189,248,0.85)]" />
        {eyebrow}
      </div>
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-100 text-balance">
        {title}
      </h2>
      {description ? (
        <p className="text-base md:text-lg text-slate-400 max-w-2xl">
          {description}
        </p>
      ) : null}
    </motion.div>
  );
}

