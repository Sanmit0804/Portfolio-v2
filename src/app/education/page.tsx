'use client';

import { motion, Variants } from 'framer-motion';
import data from '@/data/data.json';
import { GraduationCap } from 'lucide-react';
import Link from 'next/link';

const pageVars: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } as any },
};

const stagger: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.2 } as any },
};

const item: Variants = {
  hidden: { opacity: 0, x: -30 },
  show: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 80, damping: 14 } as any },
};

export default function EducationPage() {
  return (
    <main className="relative min-h-screen w-full bg-black text-white overflow-y-auto pb-28">
      <div className="absolute bottom-1/3 right-1/4 w-[40vw] h-[40vw] bg-blue-900/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-4xl mx-auto px-6 md:px-12 pt-24">

        <motion.div variants={pageVars} initial="hidden" animate="show" className="mb-16">
          <span className="text-xs uppercase tracking-[0.35em] text-blue-400/80 font-inter">Academic Journey</span>
          <h1 className="mt-3 font-outfit font-black tracking-tighter text-white leading-none"
            style={{ fontSize: 'clamp(2.5rem, 8vw, 6rem)' }}>
            Education
          </h1>
          <div className="mt-4 h-[1px] w-24 bg-gradient-to-r from-blue-500/50 to-transparent" />
        </motion.div>

        {/* Timeline */}
        <motion.div variants={stagger} initial="hidden" animate="show" className="relative flex flex-col gap-0">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-[1px] bg-gradient-to-b from-blue-500/50 via-white/10 to-transparent" />

          {data.education.map((edu, i) => (
            <motion.div key={i} variants={item} className="relative pl-16 pb-12">
              {/* Timeline dot */}
              <div className="absolute left-[19px] top-1 w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.6)] flex-shrink-0" />

              <div className="liquid-glass p-8 flex flex-col gap-4 hover:border-white/20 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <GraduationCap className="w-6 h-6 text-blue-400 flex-shrink-0" />
                    <Link
                      href={edu.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/edu-link"
                    >
                      <h2 className="text-xl font-outfit font-semibold text-white/90 group-hover/edu-link:text-blue-400 transition-colors duration-300">
                        {edu.degree}
                      </h2>
                    </Link>
                  </div>
                  <span className="text-xs font-inter text-white/40 border border-white/10 rounded-full px-3 py-1 whitespace-nowrap">
                    {edu.year}
                  </span>
                </div>
                <Link
                  href={edu.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-fit font-inter text-white/60 font-medium hover:text-blue-300 transition-colors duration-300"
                >
                  {edu.institution}
                </Link>
                <p className="text-sm font-inter text-white/50 leading-relaxed">{edu.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </main>
  );
}
