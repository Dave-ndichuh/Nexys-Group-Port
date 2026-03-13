'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Project } from './constants/projects';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const categoryColors: Record<string, string> = {
    'AI & Software': 'bg-blue-600/25 text-blue-300 border-blue-600/50',
    'Smart Habitats': 'bg-emerald-700/25 text-emerald-300 border-emerald-700/50',
    'Physical Engineering': 'bg-amber-700/25 text-amber-200 border-amber-700/50',
    'Cultural Tech': 'bg-slate-600/25 text-slate-300 border-slate-600/50',
  };

  return (
    <motion.div
      layoutId={project.id}
      onClick={onClick}
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="cursor-pointer group relative overflow-hidden rounded-xl glass-subtle hover:glass transition-all duration-300 h-full"
    >
      {/* Background gradient echoing emblem palette */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${project.bgGradient} opacity-20 group-hover:opacity-35 transition-opacity duration-300`}
      ></div>

      {/* Content */}
      <div className="relative h-full p-6 md:p-8 flex flex-col justify-between">
        <div>
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[0.7rem] font-semibold tracking-wide mb-4 border ${categoryColors[project.category]}`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-slate-100/80" />
            {project.category}
          </div>

          <h3 className="text-xl md:text-2xl font-semibold text-slate-100 mb-3 group-hover:text-cyan-300 transition-colors">
            {project.title}
          </h3>

          <p className="text-slate-400 text-sm md:text-base leading-relaxed line-clamp-3 mb-3">
            {project.brief}
          </p>

          <p className="text-xs text-slate-500 line-clamp-2">
            {project.region} · {project.stage}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/10">
          <div className="flex gap-2 flex-wrap">
            {project.techStack.slice(0, 2).map((tech) => (
              <span key={tech} className="text-xs text-slate-400 px-2 py-1 bg-white/5 rounded">
                {tech}
              </span>
            ))}
            {project.techStack.length > 2 && (
              <span className="text-xs text-slate-500 px-2 py-1">
                +{project.techStack.length - 2}
              </span>
            )}
          </div>

          <motion.div
            whileHover={{ x: 4 }}
            className="text-blue-500 group-hover:text-blue-400 transition-colors"
          >
            <ArrowRight size={20} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
