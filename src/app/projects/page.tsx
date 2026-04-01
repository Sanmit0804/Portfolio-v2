'use client';

import { motion, Variants } from 'framer-motion';
import data from '@/data/data.json';
import { ExternalLink, FolderGit2, Folder } from 'lucide-react';
import { useState } from 'react';

const pageVars: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } as any },
};

const stagger: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } as any },
};

const card: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 24 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } as any },
};

export default function ProjectsPage() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <main className="relative min-h-screen w-full bg-black text-white overflow-y-auto pb-28">
      <div className="absolute top-1/4 right-1/4 w-[45vw] h-[45vw] bg-blue-900/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="w-full max-w-6xl mx-auto px-6 md:px-12 pt-24">

        <motion.div variants={pageVars} initial="hidden" animate="show" className="mb-16">
          <span className="text-xs uppercase tracking-[0.35em] text-blue-400/80 font-inter">Work</span>
          <h1 className="mt-3 font-outfit font-black tracking-tighter text-white leading-none"
            style={{ fontSize: 'clamp(2.5rem, 8vw, 6rem)' }}>
            Projects
          </h1>
          <div className="mt-4 h-[1px] w-24 bg-gradient-to-r from-blue-500/50 to-transparent" />
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {data.projects.map((proj, idx) => (
            <motion.div
              key={idx}
              variants={card}
              onMouseEnter={() => setHovered(idx)}
              onMouseLeave={() => setHovered(null)}
              className="group relative liquid-glass p-8 flex flex-col justify-between overflow-hidden hover:border-white/20 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-8">
                <Folder className="w-10 h-10 text-blue-400 opacity-80" />
                <div className="flex gap-4">
                  {proj.code && (
                    <a href={proj.code} target="_blank" rel="noopener noreferrer"
                      className="group/tooltip relative p-2.5 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 text-white/40 hover:text-white transition-all duration-300">
                      <FolderGit2 className="w-5 h-5" />
                      {/* Custom Tooltip */}
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap px-3 py-1.5 liquid-glass text-[10px] font-inter font-medium tracking-wider pointer-events-none z-50">
                        GitHub
                      </span>
                    </a>
                  )}
                  {proj.demo && (
                    <a href={proj.demo} target="_blank" rel="noopener noreferrer"
                      className="group/tooltip relative p-2.5 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 text-white/40 hover:text-white transition-all duration-300">
                      <ExternalLink className="w-5 h-5" />
                      {/* Custom Tooltip */}
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap px-3 py-1.5 liquid-glass text-[10px] font-inter font-medium tracking-wider pointer-events-none z-50">
                        Live Demo
                      </span>
                    </a>
                  )}
                </div>
              </div>

              <div className="flex-grow space-y-3">
                <h2 className="text-2xl font-outfit font-semibold text-white/90 group-hover:text-blue-400 transition-colors">
                  {proj.title}
                </h2>
                <p className="text-sm font-inter text-white/60 leading-relaxed">{proj.description}</p>
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                {proj.tags.map((tag, ti) => (
                  <span key={ti} className="text-xs font-inter text-white/40 tracking-wide">{tag}</span>
                ))}
              </div>

              {/* Hover shimmer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: hovered === idx ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-transparent pointer-events-none"
              />
            </motion.div>
          ))}
        </motion.div>

      </div>
    </main>
  );
}
