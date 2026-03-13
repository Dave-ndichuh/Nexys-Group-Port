'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Project } from './constants/projects';

interface ProjectDrawerProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectDrawer({ project, isOpen, onClose }: ProjectDrawerProps) {
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const shouldRender = !!project && isOpen;

  useEffect(() => {
    if (!shouldRender) return;

    const node = drawerRef.current;
    if (node) {
      node.focus();
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [shouldRender, onClose]);

  if (!project) return null;

  const categoryColors: Record<string, string> = {
    'AI & Software': 'bg-blue-600/25 text-blue-300 border-blue-600/50',
    'Smart Habitats': 'bg-emerald-700/25 text-emerald-300 border-emerald-700/50',
    'Physical Engineering': 'bg-amber-700/25 text-amber-200 border-amber-700/50',
    'Cultural Tech': 'bg-slate-600/25 text-slate-300 border-slate-600/50',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Drawer */}
          <motion.div
            ref={drawerRef}
            tabIndex={-1}
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed right-0 top-0 h-screen w-full md:w-96 bg-slate-900/95 border-l border-slate-700/50 z-50 flex flex-col overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 border-b border-slate-700/70 p-6 glass flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-100">Project Details</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Close drawer"
              >
                <X size={24} className="text-slate-400 hover:text-slate-100" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 space-y-6">
              {/* Title & Category */}
              <div>
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[0.7rem] font-semibold tracking-wide mb-4 border ${categoryColors[project.category]}`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-100/80" />
                  {project.category}
                </div>
                <h3 className="text-3xl font-bold text-slate-100">{project.title}</h3>
              </div>

              {/* Background gradient preview */}
              <div
                className={`w-full h-48 rounded-lg bg-gradient-to-br ${project.bgGradient} opacity-25`}
              ></div>

              {/* Brief */}
              <div>
                <h4 className="text-sm font-semibold text-slate-400 mb-2">Overview</h4>
                <p className="text-slate-300 leading-relaxed">{project.brief}</p>
              </div>

              {/* Snapshot */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-lg border border-slate-700/60 bg-slate-900/70">
                  <p className="text-[0.7rem] uppercase tracking-[0.18em] text-slate-500 mb-1">
                    Stage
                  </p>
                  <p className="text-sm font-semibold text-slate-100">{project.stage}</p>
                </div>
                <div className="p-3 rounded-lg border border-slate-700/60 bg-slate-900/70">
                  <p className="text-[0.7rem] uppercase tracking-[0.18em] text-slate-500 mb-1">
                    Region
                  </p>
                  <p className="text-sm text-slate-200">{project.region}</p>
                </div>
                <div className="p-3 rounded-lg border border-slate-700/60 bg-slate-900/70">
                  <p className="text-[0.7rem] uppercase tracking-[0.18em] text-slate-500 mb-1">
                    Stack
                  </p>
                  <p className="text-xs text-slate-300 line-clamp-2">
                    {project.techStack.join(' · ')}
                  </p>
                </div>
              </div>

              {/* Investment thesis */}
              <div className="pt-2">
                <h4 className="text-sm font-semibold text-slate-400 mb-2">Why this venture</h4>
                <p className="text-slate-300 text-sm leading-relaxed">{project.thesis}</p>
              </div>

              {/* CTA */}
              <motion.a
                href={`#${project.id}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full py-3 gradient-tech text-white font-semibold rounded-lg text-center hover:shadow-lg hover:shadow-blue-500/30 transition-shadow block"
              >
                View Project
              </motion.a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
