'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { projects, categories, type Project } from './constants/projects';
import { ProjectCard } from './ProjectCard';
import { ProjectDrawer } from './ProjectDrawer';
import { SectionHeader } from './SectionHeader';

export function Portfolio() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const filteredProjects =
    selectedCategory === 'All'
      ? projects
      : projects.filter((p) => p.category === selectedCategory);

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsDrawerOpen(true);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <section
      id="ventures"
      className="min-h-screen py-20 px-6 bg-slate-950 bg-etched relative overflow-hidden"
    >
      {/* Background elements echoing emblem circuitry and gearwork */}
      <div className="pointer-events-none absolute -top-32 -left-16 w-[26rem] h-[26rem] rounded-full bg-gradient-to-br from-cyan-500/14 via-blue-500/10 to-slate-900/0 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-10 w-[30rem] h-[30rem] rounded-full bg-gradient-to-tr from-amber-600/18 via-amber-500/10 to-slate-900/0 blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeader
          eyebrow="Multi-Sector Portfolio"
          title="Ventures Unified"
          description="A portfolio engineered at the crossroads of AI & Software, Smart Habitats, and Physical Engineering—each venture grounded in place, culture, and long-term resilience."
        />

        {/* Filter bar + quick meta */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          viewport={{ once: true }}
          className="flex flex-col gap-4 mb-12 md:flex-row md:items-center md:justify-between"
        >
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <motion.button
                key={category}
                onClick={() => handleCategoryChange(category)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
                  selectedCategory === category
                    ? 'glass gradient-tech text-white shadow-blue-600/40 border-transparent'
                    : 'glass-subtle text-slate-300 border-slate-700/70 hover:text-blue-400'
                }`}
              >
                {category}
              </motion.button>
            ))}
          </div>

          <div className="flex gap-3 text-xs md:text-sm text-slate-400">
            <div className="px-3 py-2 rounded-lg border border-slate-700/60 bg-slate-900/70 flex items-center gap-2">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span className="font-semibold text-slate-200">{filteredProjects.length}</span>
              <span className="text-slate-500">active ventures</span>
            </div>
            <div className="hidden sm:flex px-3 py-2 rounded-lg border border-slate-800/60 bg-slate-950/80 items-center gap-2">
              <span className="h-1 w-6 rounded-full bg-gradient-to-r from-cyan-400/70 to-amber-400/70" />
              <span className="text-slate-500">Curated across AI, habitats & engineering</span>
            </div>
          </div>
        </motion.div>

        {/* Ventures grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-fr"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 30,
                }}
              >
                <ProjectCard
                  project={project}
                  onClick={() => handleProjectClick(project)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Project Drawer */}
      <ProjectDrawer
        project={selectedProject}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </section>
  );
}
