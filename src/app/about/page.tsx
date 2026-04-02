'use client';

import { motion, useSpring, useScroll, useTransform } from 'framer-motion';
import data from '@/data/data.json';
import { User, Code, BookOpen, ArrowRight } from 'lucide-react';
import FramesRendering from '@/components/FramesRendering';
import BlurText from '@/components/animations/BlurText';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function AboutPage() {
  const { scrollY, scrollYProgress } = useScroll();
  const scrollIndicatorOpacity = useTransform(scrollY, [0, 50], [1, 0]);

  const springProgress = useSpring(scrollYProgress, {
    stiffness: 45,
    damping: 35,
    mass: 1.2
  });

  const handleScrollToNext = () => {
    window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
  };

  return (
    <main className="relative w-full bg-[#000000] text-white select-none font-inter overflow-x-hidden">
      {/* Background Frame Sequence with Cinematic Scaling & Vignette */}
      <div className="fixed inset-0 w-full h-screen z-0 pointer-events-none flex items-center justify-center bg-[#000000]">

        {/* Scaled-down frame container to prevent pixelation issues on large screens.
            Added slight blur, contrast, and lowered saturation to make the low-res beautiful. */}
        <div className="relative w-full h-[60vh] md:w-[65vw] md:h-[75vh] overflow-hidden opacity-80 mix-blend-screen scale-[1.1] sm:scale-100" style={{ filter: 'blur(3px) contrast(1.2) saturate(0.5)' }}>
          <FramesRendering scrollProgress={springProgress} />
        </div>

        {/* Intensely aggressive, thick vignette to completely hide frame boundaries */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_10%,_#000000_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_20%,_#000000_100%)] mix-blend-multiply" />

        {/* Very thick edge shadows extending deep into the canvas */}
        <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-[#000000] via-[#000000]/80 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-[#000000] via-[#000000]/80 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-[#000000] via-[#000000]/80 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#000000] via-[#000000]/90 to-transparent" />
      </div>

      <div className="relative z-10 w-full flex flex-col" onPointerCancel={(e) => e.stopPropagation()}>

        {/* --- SECTION 1: Welcome Hero --- */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true, amount: 0.1 }}
          className="relative min-h-screen w-full px-8 py-12 md:px-16 md:py-16 flex flex-col justify-between pointer-events-none"
        >
          {/* Top Row */}
          <div className="flex justify-end w-full pt-8 pointer-events-auto">
            <div className="flex gap-6 text-sm font-semibold tracking-[0.2em] text-white/50 hover:text-white/80 transition-colors">
              <a href={data.bio.github} target="_blank" className="hover:text-white transition-colors">GH</a>
              <a href={data.bio.linkedin} target="_blank" className="hover:text-white transition-colors">LI</a>
              <a href={data.bio.twitter} target="_blank" className="hover:text-white transition-colors">X</a>
            </div>
          </div>

          {/* Bottom Content Area */}
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-end pb-12">

            {/* Left Texts */}
            <div className="col-span-1 lg:col-span-8">
              <BlurText text={`Welcome to ${data.bio.name.split(' ')[0]}'s World:`} className="text-sm md:text-base tracking-[0.1em] text-blue-400 mb-2 font-light" delay={200} />

              <div className="font-outfit font-black tracking-tight leading-[0.85] text-white flex flex-col">
                <BlurText text="WHERE CODE" className="text-6xl md:text-8xl lg:text-[6rem] drop-shadow-2xl" delay={400} />
                <div className="flex items-center gap-4 lg:gap-8 mt-2 lg:mt-0">
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1.2, type: 'spring', stiffness: 100 }}
                    className="w-12 h-12 lg:w-20 lg:h-20 flex-shrink-0 flex items-center justify-center border-2 border-white/20 rounded-full bg-black/20 backdrop-blur-sm"
                  >
                    <div className="w-8 h-8 lg:w-12 lg:h-12 flex items-center justify-center">
                      <div className="flex gap-1 items-center justify-center">
                        <span className="w-1 h-3 lg:h-5 bg-white rounded-full animate-pulse shadow-[0_0_10px_white]" />
                        <span className="w-1 h-5 lg:h-8 bg-white rounded-full animate-pulse delay-75 shadow-[0_0_10px_white]" />
                        <span className="w-1 h-3 lg:h-5 bg-white rounded-full animate-pulse delay-150 shadow-[0_0_10px_white]" />
                      </div>
                    </div>
                  </motion.div>
                  <BlurText text="MEETS LOGIC" className="text-6xl md:text-8xl lg:text-[6rem] uppercase drop-shadow-2xl" delay={600} />
                </div>
              </div>
            </div>

            {/* Right Cta & Paragraph */}
            <div className="col-span-1 lg:col-span-4 flex flex-col items-start lg:items-end text-left lg:text-right pointer-events-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="mb-8"
              >
                <Button onClick={handleScrollToNext} variant="outline" size="md">
                  <span>Explore My World</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                className="text-sm md:text-base text-white/50 leading-relaxed font-light max-w-sm drop-shadow-md"
              >
                Join me on a continuous journey through the rigorous realm of engineering and design, where every line of code weaves a story, and every product is a thoughtful architecture.
              </motion.p>
            </div>
          </div>
        </motion.section>

        {/* --- SECTION 2: Who I Am (Bio) --- */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="relative min-h-screen w-full px-6 py-24 md:px-12 flex flex-col items-center justify-center"
        >
          <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row gap-12 lg:gap-24 pointer-events-auto items-start">

            {/* Left Header & Meta */}
            <div className="w-full md:w-1/3 flex flex-col pt-2">
              <span className="text-xs md:text-sm uppercase tracking-[0.4em] text-blue-400 font-medium drop-shadow-lg">Who I Am</span>
              <h2 className="text-5xl md:text-7xl font-outfit font-black tracking-tighter text-white mt-4 drop-shadow-2xl">The Architect</h2>
              <div className="mt-8 mb-12 h-[1px] w-1/2 bg-gradient-to-r from-blue-500 to-transparent opacity-50" />

              <div className="flex flex-col gap-8 mt-2">
                <div>
                  <p className="text-[10px] md:text-xs uppercase tracking-widest text-white/40 font-semibold mb-2">Base</p>
                  <p className="font-outfit font-medium text-white/90 drop-shadow-md text-lg md:text-xl tracking-tight">{data.contact.location.split(',')[0]}</p>
                </div>
                <div>
                  <p className="text-[10px] md:text-xs uppercase tracking-widest text-white/40 font-semibold mb-3">Priority Status</p>
                  <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-full border border-blue-500/20 bg-blue-500/5 backdrop-blur-md">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,1)]"></span>
                    </span>
                    <span className="font-outfit font-medium text-blue-300 text-sm tracking-wide">Available</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Bio Text */}
            <div className="w-full md:w-2/3 flex flex-col">
              <div className="relative">
                {/* Modern subtle accent line on the left of the text block */}
                <div className="hidden md:block absolute left-0 top-3 bottom-0 w-[1px] bg-gradient-to-b from-blue-500 via-blue-500/20 to-transparent opacity-50" />

                <div className="md:pl-10 space-y-8">
                  {/* First paragraph stands out larger */}
                  <p className="text-xl md:text-3xl font-light text-white leading-[1.6] tracking-tight drop-shadow-xl selection:bg-blue-500/30">
                    {data.bio.about[0]}
                  </p>

                  {/* Subsequent paragraphs slightly muted */}
                  <div className="space-y-6 text-base md:text-xl text-white/60 leading-relaxed font-light selection:bg-blue-500/30">
                    {data.bio.about.slice(1).map((p, i) => (
                      <p key={i} className="hover:text-white/80 transition-colors duration-500">{p}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </motion.section>

        {/* --- SECTION 3: Tech Stack & Contact --- */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="relative min-h-[80vh] w-full px-6 py-24 md:px-12 flex flex-col items-center justify-center mb-32"
        >
          <div className="w-full max-w-7xl mx-auto flex flex-col gap-12 pointer-events-auto items-center">

            <div className="text-center flex flex-col items-center justify-center">
              <span className="text-xs uppercase tracking-[0.35em] text-blue-300 drop-shadow-md mb-4 flex items-center gap-2">
                <Code className="w-4 h-4 text-blue-400" /> Capabilities
              </span>
              <h2 className="text-4xl md:text-7xl font-outfit font-black tracking-tighter text-white drop-shadow-2xl">
                Tech Arsenal
              </h2>
            </div>

            <div className="w-full max-w-5xl mx-auto mt-6 md:mt-8 px-2 md:px-4">
              <div className="flex flex-wrap justify-center gap-2 md:gap-4">
                {data.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="group relative px-4 py-2 md:px-6 md:py-3 overflow-hidden rounded-full border border-white/10 bg-[#000000]/40 backdrop-blur-md text-white/60 hover:text-white transition-colors duration-500 cursor-default"
                  >
                    <span className="relative z-10 font-outfit font-light tracking-wider text-[11px] md:text-base">{skill}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-500/20 to-blue-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
                    <div className="absolute inset-0 border border-blue-500/0 group-hover:border-blue-500/50 rounded-full transition-colors duration-500 pointer-events-none" />
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center justify-center w-full max-w-xs md:max-w-none mt-8 md:mt-12">
              <Button href="/contact" variant="primary" className="w-full md:w-auto">
                Let's Connect
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1" />
              </Button>
              <Button href="/projects" variant="outline" className="w-full md:w-auto">
                View Projects
              </Button>
            </div>

          </div>
        </motion.section>

      </div>

      {/* Persistent Scroll Indicator */}
      <motion.div
        style={{ opacity: scrollIndicatorOpacity }}
        className="fixed bottom-20 lg:bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none z-50 text-white/40 mix-blend-difference"
      >
        <div className="text-[10px] uppercase tracking-[0.2em] font-medium drop-shadow-md">Scroll</div>
        <div className="w-[1px] h-8 bg-gradient-to-b from-white/50 to-transparent" />
      </motion.div>
    </main>
  );
}
