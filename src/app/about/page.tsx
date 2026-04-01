'use client';

import { motion, Variants, useSpring, useTransform, useMotionValue } from 'framer-motion';
import { useRef } from 'react';
import data from '@/data/data.json';
import { User, Code, BookOpen } from 'lucide-react';
import FramesRendering from '@/components/FramesRendering';
import LogoWall from '@/components/animations/LogoWall';

const pageVars: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } as any },
};

const stagger: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } as any },
};

const card: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } as any },
};

export default function AboutPage() {
  // Virtual scroll implementation for a static page that scrubs the animation
  const scrollTracker = useMotionValue(0);
  const maxScroll = 2500; // Simulated scroll depth for the sequence

  const scrollYProgress = useTransform(scrollTracker, [0, maxScroll], [0, 1]);

  // Heavy, deliberate easing for mapping progress
  const springProgress = useSpring(scrollYProgress, {
    stiffness: 45,
    damping: 35,
    mass: 1.2
  });

  const handleWheel = (e: React.WheelEvent) => {
    const current = scrollTracker.get();
    scrollTracker.set(Math.max(0, Math.min(current + e.deltaY, maxScroll)));
  };

  const touchStartY = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentY = e.touches[0].clientY;
    const deltaY = touchStartY.current - currentY;
    touchStartY.current = currentY;
    
    const current = scrollTracker.get();
    scrollTracker.set(Math.max(0, Math.min(current + deltaY * 2.5, maxScroll)));
  };

  return (
    <main 
      className="relative w-full h-screen overflow-hidden bg-[#011c0d] text-white select-none"
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      {/* Real-time calculated hardware-accelerated canvas background */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <FramesRendering scrollProgress={springProgress} />
        
        {/* Cinematic Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_10%,_#011c0d_90%)] mix-blend-multiply" />
        <div className="absolute inset-0 bg-black/40 mix-blend-multiply" />
      </div>

      {/* Text and CTAs perfectly centered and completely static */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-6 md:px-12 py-12 lg:py-0 overflow-y-auto lg:overflow-hidden touch-pan-y"
           onPointerCancel={(e) => e.stopPropagation()}> 
           {/* Add overflow-y on mobile if screen is incredibly tiny to ensure readability without breaking effect */}
        <div className="w-full max-w-6xl mx-auto">
          {/* Page title */}
          <motion.div variants={pageVars} initial="hidden" animate="show" className="mb-12">
            <span className="text-xs uppercase tracking-[0.35em] text-blue-400/80 font-inter">Who I Am</span>
            <h1 className="mt-3 font-outfit font-black tracking-tighter text-white leading-none drop-shadow-xl"
              style={{ fontSize: 'clamp(2.5rem, 8vw, 6rem)' }}>
              About Me
            </h1>
            <div className="mt-4 h-[1px] w-24 bg-gradient-to-r from-blue-500/50 to-transparent" />
          </motion.div>

          <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* Bio paragraph cards */}
            <motion.div variants={card} className="liquid-glass p-8 col-span-1 md:col-span-2 flex flex-col gap-5 border border-white/10 bg-white/5 backdrop-blur-md rounded-2xl hover:border-white/20 transition-colors shadow-2xl">
              <User className="w-8 h-8 text-blue-400" />
              <div className="space-y-4 text-white/90 font-inter text-sm leading-relaxed drop-shadow-sm">
                {data.bio.about.map((p, i) => <p key={i}>{p}</p>)}
              </div>
            </motion.div>

            {/* Quick facts */}
            <motion.div variants={card} className="liquid-glass p-8 flex flex-col gap-6 border border-white/10 bg-white/5 backdrop-blur-md rounded-2xl hover:border-white/20 transition-colors shadow-2xl">
              <BookOpen className="w-8 h-8 text-blue-400" />
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/50">Location</p>
                  <p className="mt-1 font-outfit font-medium text-white/90 shadow-sm">{data.contact.location}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/50">Email</p>
                  <a href={`mailto:${data.contact.email}`} className="mt-1 block font-outfit font-medium text-blue-400 hover:text-blue-300 transition-colors break-all shadow-sm">
                    {data.contact.email}
                  </a>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/50">GitHub</p>
                  <a href={data.bio.github} target="_blank" rel="noopener noreferrer"
                    className="mt-1 block font-outfit font-medium text-blue-400 hover:text-blue-300 transition-colors break-all shadow-sm">
                    {data.bio.github.replace('https://', '')}
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Tech Stack */}
            <motion.div variants={card} className="liquid-glass p-8 col-span-1 md:col-span-3 border border-white/10 bg-white/5 backdrop-blur-md rounded-2xl hover:border-white/20 transition-colors shadow-2xl flex flex-col md:flex-row gap-8 items-start md:items-center">
              <div className="flex-shrink-0 flex items-center gap-4">
                <Code className="w-8 h-8 text-emerald-400" />
                <h2 className="text-2xl font-outfit font-semibold text-white/90 drop-shadow-sm whitespace-nowrap">Tech Stack</h2>
              </div>
              <div className="flex-grow w-full relative">
                <LogoWall
                  items={data.skills.map((skill, i) => (
                    <span key={i} className="px-5 py-2 whitespace-nowrap rounded-full border border-white/10 bg-black/40 text-sm font-inter text-white hover:bg-white/10 transition-colors cursor-default shadow-sm backdrop-blur-sm">
                      {skill}
                    </span>
                  ))}
                  pauseOnHover={true}
                  size="auto"
                  duration="30s"
                />
              </div>
            </motion.div>

          </motion.div>
        </div>
      </div>
    </main>
  );
}
