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
    <main className="relative min-h-screen w-full bg-black text-white overflow-y-auto pb-24 md:pb-28 overflow-x-hidden">
      <div className="absolute top-1/4 right-1/4 w-[45vw] h-[45vw] bg-blue-900/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-12 pt-16 sm:pt-20 md:pt-24">

        <motion.div variants={pageVars} initial="hidden" animate="show" className="mb-8 sm:mb-12 md:mb-16">
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.35em] text-blue-400/80 font-inter">Work</span>
          <h1 className="mt-2 sm:mt-3 font-outfit font-black tracking-tighter text-white leading-none"
            style={{ fontSize: 'clamp(2rem, 9vw, 6rem)' }}>
            Projects
          </h1>
          <div className="mt-3 sm:mt-4 h-[1px] w-16 sm:w-24 bg-gradient-to-r from-blue-500/50 to-transparent" />
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8"
        >
          {data.projects.map((proj, idx) => (
            <motion.div
              key={idx}
              variants={card}
              onMouseEnter={() => setHovered(idx)}
              onMouseLeave={() => setHovered(null)}
              className="group relative liquid-glass p-5 sm:p-6 md:p-8 flex flex-col justify-between overflow-hidden hover:border-white/20 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-5 sm:mb-6 md:mb-8">
                <Folder className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-blue-400 opacity-80" />
                <div className="flex gap-2 sm:gap-4">
                  {proj.code && (
                    <a href={proj.code} target="_blank" rel="noopener noreferrer"
                      className="group/tooltip relative p-2 sm:p-2.5 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 text-white/40 hover:text-white transition-all duration-300">
                      <FolderGit2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap px-3 py-1.5 liquid-glass text-[10px] font-inter font-medium tracking-wider pointer-events-none z-50">
                        GitHub
                      </span>
                    </a>
                  )}
                  {proj.demo && (
                    <a href={proj.demo} target="_blank" rel="noopener noreferrer"
                      className="group/tooltip relative p-2 sm:p-2.5 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 text-white/40 hover:text-white transition-all duration-300">
                      <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap px-3 py-1.5 liquid-glass text-[10px] font-inter font-medium tracking-wider pointer-events-none z-50">
                        Live Demo
                      </span>
                    </a>
                  )}
                </div>
              </div>

              <div className="flex-grow space-y-2 sm:space-y-3">
                <h2 className="text-lg sm:text-xl md:text-2xl font-outfit font-semibold text-white/90 group-hover:text-blue-400 transition-colors">
                  {proj.title}
                </h2>
                <p className="text-xs sm:text-sm font-inter text-white/60 leading-relaxed">{proj.description}</p>
              </div>

              <div className="mt-5 sm:mt-6 md:mt-8 flex flex-wrap gap-1.5 sm:gap-2">
                {proj.tags.map((tag, ti) => (
                  <span key={ti} className="text-[10px] sm:text-xs font-inter text-white/40 tracking-wide bg-white/[0.04] border border-white/[0.06] rounded-full px-2 py-0.5">{tag}</span>
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
