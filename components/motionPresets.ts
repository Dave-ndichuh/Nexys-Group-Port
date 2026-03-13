'use client';

import type { Variants } from 'framer-motion';

export const staggerContainer = (
  staggerChildren = 0.2,
  delayChildren = 0.3,
): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

export const fadeInUp = (distance = 20, duration = 0.8): Variants => ({
  hidden: { opacity: 0, y: distance },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration, ease: 'easeOut' },
  },
});

export const fadeIn = (duration = 0.6): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration, ease: 'easeOut' },
  },
});

