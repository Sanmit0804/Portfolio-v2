'use client';

import { motion, Variants } from 'framer-motion';
import { useState } from 'react';
import data from '@/data/data.json';
import { FileText, Download, Briefcase, Calendar, Building2, ChevronRight, ExternalLink } from 'lucide-react';

const pageVars: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } as any },
};

const sectionVars: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

const itemVars: Variants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

interface Experience {
  title: string;
  company: string;
  year: string;
  description: string;
}

const ExperienceCard = ({ experience, index }: { experience: Experience; index: number }) => {
  return (
    <motion.div
      variants={itemVars}
      custom={index}
      className="group relative p-5 sm:p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10"
    >
      {/* Gradient hover effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/0 via-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5" />

      <div className="relative z-10">
        {/* Mobile-first: stack vertically, then row on sm+ */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-400/20 flex-shrink-0">
              <Briefcase className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-outfit font-semibold text-white/90 group-hover:text-blue-400 transition-colors break-words">
                {experience.title}
              </h3>
              <div className="flex items-center gap-2 mt-1 text-white/60 flex-wrap">
                <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-inter break-words">{experience.company}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white/5 border border-white/10 self-start sm:self-auto">
            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />
            <span className="text-xs sm:text-sm font-inter whitespace-nowrap text-white/70">{experience.year}</span>
          </div>
        </div>

        {experience.description && (
          <p className="text-white/60 font-inter text-xs sm:text-sm leading-relaxed pl-9 sm:pl-11 break-words">
            {experience.description}
          </p>
        )}
      </div>
    </motion.div>
  );
};

const ResumeCard = () => {
  return (
    <div className="liquid-glass p-5 sm:p-7 md:p-10 flex flex-col items-center gap-4 sm:gap-5 text-center w-full">
      <div className="p-2.5 sm:p-3 md:p-4 rounded-full bg-blue-500/10 border border-blue-400/20">
        <FileText className="w-7 h-7 sm:w-9 sm:h-9 md:w-12 md:h-12 text-blue-400 opacity-80" />
      </div>
      <div>
        <h2 className="text-lg sm:text-xl md:text-2xl font-outfit font-semibold text-white/90 break-words px-2">
          {data.bio.name}
        </h2>
        <p className="text-[11px] sm:text-sm text-white/50 font-inter mt-1.5 break-words">
          {data.bio.designation?.[0] || 'Professional'}
        </p>
      </div>
      <p className="text-[11px] sm:text-sm text-white/50 font-inter leading-relaxed text-center px-2">
        Download or view my full resume to learn more about my experience, education, and skills.
      </p>
      <a
        href="/assets/resume.pdf"
        download
        className="liquid-glass text-nowrap flex gap-2 sm:gap-3 items-center p-3 sm:p-4 rounded-full hover:bg-white/10 hover:border-white/20 transition-colors text-white/50 hover:text-white"
      >
        <Download className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 group-hover:-translate-y-0.5 transition-transform" />
        <span className="font-outfit font-medium text-white/90 text-sm sm:text-base">Download Resume</span>
      </a>
    </div>
  );
};

export default function ResumePage() {
  const experiences: Experience[] = data.experience || [];

  return (
    <main className="relative min-h-screen w-full bg-black text-white overflow-x-hidden pb-24 sm:pb-24 md:pb-28 flex flex-col">
      {/* Background gradient - responsive positioning */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.08)_0%,_transparent_60%)] pointer-events-none" />

      {/* Animated grid pattern - adjusted for mobile */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.02)_1px,transparent_1px)] bg-[size:30px_30px] sm:bg-[size:40px_40px] pointer-events-none" />

      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-12 pt-14 sm:pt-20 md:pt-24 flex-grow flex flex-col">
        {/* Header */}
        <motion.div variants={pageVars} initial="hidden" animate="show" className="mb-6 sm:mb-8 md:mb-12">
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.35em] text-blue-400/80 font-inter">
            Credentials
          </span>
          <h1
            className="mt-2 sm:mt-3 font-outfit font-black tracking-tighter text-white leading-[1.1] sm:leading-none"
            style={{ fontSize: 'clamp(1.8rem, 9vw, 5rem)' }}
          >
            Resume
          </h1>
          <div className="mt-3 sm:mt-4 h-[1px] w-12 sm:w-16 md:w-24 bg-gradient-to-r from-blue-500/50 to-transparent" />
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
          {/* Left Column - Resume Download Card */}
          <motion.div
            variants={sectionVars}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.2 }}
            className="flex justify-center lg:justify-start"
          >
            <ResumeCard />
          </motion.div>

          {/* Right Column - Experience */}
          <motion.div
            variants={sectionVars}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.3 }}
            className="space-y-5 sm:space-y-6"
          >
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="h-px flex-1 bg-gradient-to-r from-blue-500/30 to-transparent" />
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.35em] text-blue-400/80 font-inter flex items-center gap-1.5 sm:gap-2 whitespace-nowrap">
                <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">Professional Journey</span>
                <span className="xs:hidden">Journey</span>
              </span>
              <div className="h-px flex-1 bg-gradient-to-l from-blue-500/30 to-transparent" />
            </div>

            {experiences.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {experiences.map((exp, idx) => (
                  <ExperienceCard key={idx} experience={exp} index={idx} />
                ))}
              </div>
            ) : (
              <motion.div
                variants={itemVars}
                className="p-6 sm:p-8 text-center rounded-2xl bg-white/5 border border-white/10"
              >
                <Briefcase className="w-10 h-10 sm:w-12 sm:h-12 text-white/30 mx-auto mb-3" />
                <p className="text-white/50 font-inter text-sm sm:text-base">No experience data available</p>
              </motion.div>
            )}

            {/* View Full Resume Link */}
            <motion.div
              variants={itemVars}
              className="pt-3 sm:pt-4 text-center"
            >
              <a
                href="/assets/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-blue-400/70 hover:text-blue-400 transition-colors group"
              >
                <span>View full resume details</span>
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Additional Info Section - responsive spacing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-white/10"
        >
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-white/40 font-inter">
            <div className="flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>PDF available for download</span>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {/* <span>{experiences.length}+ years experience</span> */}
              <span>1.5+ years experience</span>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}