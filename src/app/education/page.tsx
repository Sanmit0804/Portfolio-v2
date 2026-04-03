'use client';

import { motion, Variants } from 'framer-motion';
import data from '@/data/data.json';
import { GraduationCap, CalendarDays, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import ThreadsBackground from '@/components/ThreadsBackground';

const pageVars: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } as any },
};

const stagger: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } as any },
};

const card: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 90, damping: 18 } as any },
};

export default function EducationPage() {
  return (
    <main className="relative min-h-screen w-full bg-black text-white overflow-y-auto overflow-x-hidden pb-24 md:pb-28">
      <ThreadsBackground />
      {/* Ambient glow */}
      <div className="absolute bottom-1/3 right-1/4 w-[50vw] h-[50vw] bg-blue-900/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-[30vw] h-[30vw] bg-blue-800/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Animated grid pattern - adjusted for mobile */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.02)_1px,transparent_1px)] bg-[size:30px_30px] sm:bg-[size:40px_40px] pointer-events-none" />

      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 md:px-10 pt-16 sm:pt-20 md:pt-24">

        {/* Page header */}
        <motion.div variants={pageVars} initial="hidden" animate="show" className="mb-10 sm:mb-14 md:mb-16">
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.35em] text-blue-400/80 font-inter">
            Academic Journey
          </span>
          <h1
            className="mt-2 sm:mt-3 font-outfit font-black tracking-tighter text-white leading-none"
            style={{ fontSize: 'clamp(2.2rem, 9vw, 5.5rem)' }}
          >
            Education
          </h1>
          <div className="mt-3 sm:mt-4 h-[1px] w-16 sm:w-24 bg-gradient-to-r from-blue-500/50 to-transparent" />
        </motion.div>

        {/* Cards */}
        <motion.div variants={stagger} initial="hidden" animate="show" className="flex flex-col gap-4 sm:gap-5 md:gap-6">
          {data.education.map((edu, i) => (
            <motion.div key={i} variants={card}>
              <Link
                href={edu.link}
                target="_blank"
                rel="noopener noreferrer"
                className="backdrop-blur-sm group block liquid-glass p-5 sm:p-6 md:p-7 hover:border-white/25 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                {/* Top row: icon + degree + year */}
                <div className="flex items-start justify-between gap-3 sm:gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0 p-2 sm:p-2.5 rounded-xl bg-blue-500/10 border border-blue-400/20 group-hover:bg-blue-500/15 transition-colors">
                    <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                  </div>

                  {/* Degree + institution */}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-sm sm:text-base md:text-lg font-outfit font-semibold text-white/90 group-hover:text-blue-300 transition-colors duration-300 leading-snug pr-2">
                      {edu.degree}
                    </h2>
                    <p className="mt-1 text-xs sm:text-sm font-inter text-white/50 truncate group-hover:text-white/70 transition-colors">
                      {edu.institution}
                    </p>
                  </div>

                  {/* Year pill + external link icon */}
                  <div className="flex-shrink-0 flex flex-col items-end gap-2">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-white/10 bg-white/[0.04]">
                      <CalendarDays className="w-3 h-3 text-blue-400/70 flex-shrink-0" />
                      <span className="text-[10px] sm:text-xs font-inter text-white/50 whitespace-nowrap">{edu.year}</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-white/20 group-hover:text-blue-400/60 transition-colors" />
                  </div>
                </div>

                {/* Description (only rendered if non-empty) */}
                {edu.description && (
                  <p className="mt-4 text-xs sm:text-sm font-inter text-white/45 leading-relaxed border-t border-white/[0.06] pt-4">
                    {edu.description}
                  </p>
                )}

                {/* Hover shimmer */}
                <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-tr from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </Link>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </main>
  );
}
