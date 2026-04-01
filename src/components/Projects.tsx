'use client';

import { motion, Variants } from 'framer-motion';
import data from '@/data/data.json';
import { ExternalLink, FolderGit2, Folder } from 'lucide-react';
import { useState } from 'react';

const containerVars: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.1 } as any
  }
};

const itemVars: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 30 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 15 } as any
  }
};

export default function Projects() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <section id="projects" className="relative w-full min-h-screen py-24 px-6 md:px-12">
      {/* Decorative glow */}
      <div className="absolute top-0 right-1/4 w-[50vw] h-[50vw] bg-blue-900/10 rounded-full blur-[150px] pointer-events-none -z-10" />

      <div className="w-full max-w-6xl mx-auto flex flex-col items-center gap-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-4"
        >
          <h2 className="text-3xl md:text-5xl font-outfit font-bold tracking-tight text-gradient">
            Selected Works
          </h2>
          <div className="h-1 w-20 bg-blue-500/50 rounded-full mx-auto" />
        </motion.div>

        <motion.div
          variants={containerVars}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full"
        >
          {data.projects.map((proj, idx) => (
            <motion.div
              key={idx}
              variants={itemVars}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className="relative group h-full liquid-glass p-8 flex flex-col justify-between overflow-hidden shadow-2xl hover:border-white/20 transition-all duration-300"
            >
              {/* Top row */}
              <div className="relative z-10 flex justify-between items-start mb-8">
                <Folder className="w-10 h-10 text-blue-400 opacity-80" />
                <div className="flex gap-4">
                  {proj.code && (
                    <a href={proj.code} target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white transition-colors">
                      <FolderGit2 className="w-5 h-5" />
                    </a>
                  )}
                  {proj.demo && (
                    <a href={proj.demo} target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white transition-colors">
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="relative z-10 space-y-4 flex-grow">
                <h3 className="text-2xl font-outfit font-semibold text-white/90 group-hover:text-blue-400 transition-colors">
                  {proj.title}
                </h3>
                <p className="text-sm font-inter text-white/60 leading-relaxed">
                  {proj.description}
                </p>
              </div>

              {/* Tags */}
              <div className="relative z-10 mt-8 flex flex-wrap gap-3">
                {proj.tags.map((tag, tIdx) => (
                  <span key={tIdx} className="text-xs font-inter font-medium text-white/40 tracking-wider">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Hover gradient */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: hoveredIdx === idx ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-transparent pointer-events-none"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
