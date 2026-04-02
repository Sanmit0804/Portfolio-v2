'use client';

import { motion, Variants, AnimatePresence } from 'framer-motion';
import data from '@/data/data.json';
import { ExternalLink, FolderGit2, Folder } from 'lucide-react';
import { useState } from 'react';
import Button from '@/components/ui/Button';
import ThreadsBackground from '@/components/ThreadsBackground';

type Filter = 'all' | 'major' | 'minor';

const pageVars: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } as any },
};

const stagger: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.05 } as any },
};

const card: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 24 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } as any },
  exit: { opacity: 0, scale: 0.94, y: -12, transition: { duration: 0.25, ease: 'easeIn' } as any },
};

const FILTERS: { label: string; value: Filter; count: number }[] = [
  { label: 'All', value: 'all', count: data.projects.length },
  { label: 'Major', value: 'major', count: data.projects.filter(p => p.major).length },
  { label: 'Minor', value: 'minor', count: data.projects.filter(p => !p.major).length },
];

export default function ProjectsPage() {

  const [filter, setFilter] = useState<Filter>('all');

  const filtered = data.projects.filter(p => {
    if (filter === 'major') return p.major;
    if (filter === 'minor') return !p.major;
    return true;
  });

  return (
    <main className="relative min-h-screen w-full bg-black text-white overflow-y-auto pb-24 md:pb-28 overflow-x-hidden">
      <ThreadsBackground />
      <div className="absolute top-1/4 right-1/4 w-[45vw] h-[45vw] bg-blue-900/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-12 pt-16 sm:pt-20 md:pt-24">

        <motion.div variants={pageVars} initial="hidden" animate="show" className="mb-8 sm:mb-10 md:mb-12">
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.35em] text-blue-400/80 font-inter">Work</span>
          <h1 className="mt-2 sm:mt-3 font-outfit font-black tracking-tighter text-white leading-none"
            style={{ fontSize: 'clamp(2rem, 9vw, 6rem)' }}>
            Projects
          </h1>
          <div className="mt-3 sm:mt-4 h-[1px] w-16 sm:w-24 bg-gradient-to-r from-blue-500/50 to-transparent" />
        </motion.div>

        {/* Filter Bar */}
        <motion.div
          variants={pageVars}
          initial="hidden"
          animate="show"
          className="flex items-center gap-2 sm:gap-3 mb-8 sm:mb-10 md:mb-12"
        >
          {FILTERS.map(({ label, value, count }) => {
            const isActive = filter === value;
            return (
              <button
                key={value}
                onClick={() => setFilter(value)}
                className={[
                  'relative inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full font-outfit text-xs sm:text-sm font-medium transition-all duration-300',
                  isActive
                    ? 'bg-blue-500/20 border border-blue-400/50 text-blue-300 shadow-[0_0_16px_rgba(59,130,246,0.2)]'
                    : 'liquid-glass text-white/50 hover:text-white/80 hover:border-white/20 border border-white/5',
                ].join(' ')}
              >
                {label}
                <span className={[
                  'inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full text-[10px] font-inter px-1',
                  isActive ? 'bg-blue-400/30 text-blue-200' : 'bg-white/8 text-white/30',
                ].join(' ')}>
                  {count}
                </span>
                {isActive && (
                  <motion.span
                    layoutId="filter-indicator"
                    className="absolute inset-0 rounded-full border border-blue-400/30 pointer-events-none"
                  />
                )}
              </button>
            );
          })}
        </motion.div>

        {/* Projects Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            variants={stagger}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8"
          >
            {filtered.map((proj, idx) => (
              <motion.div
                key={proj.title}
                variants={card}
                className="group relative liquid-glass backdrop-blur-sm p-5 sm:p-6 md:p-8 flex flex-col justify-between overflow-hidden hover:border-white/20 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-5 sm:mb-6 md:mb-8">
                  <div className="flex items-center gap-3">
                    <Folder className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-blue-400 opacity-80" />
                    {proj.major && (
                      <span className="text-[9px] sm:text-[10px] font-inter font-medium tracking-wider uppercase px-2 py-0.5 rounded-full bg-blue-500/15 border border-blue-400/25 text-blue-300/80">
                        Major
                      </span>
                    )}
                  </div>
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

                {/* Hover shimmer — pure CSS, no React state, no flicker */}
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty state */}
        <AnimatePresence>
          {filtered.length === 0 && (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="flex flex-col items-center justify-center py-24 text-white/30 font-inter text-sm"
            >
              <Folder className="w-10 h-10 mb-3 opacity-30" />
              No projects found.
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </main>
  );
}
