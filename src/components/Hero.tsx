'use client';

import { motion } from 'framer-motion';
import { useAppContext } from '@/components/AppProvider';
import RotatingText from './RotatingText';
import data from '@/data/data.json';

export default function Hero() {
  const { stage } = useAppContext();

  return (
    <section className="relative h-screen w-full overflow-hidden flex items-end justify-start">

      {/* ── BACKGROUND VIDEO ── */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          className="w-full h-full object-cover"
        >
          <source src="/assets/background.webm" type="video/webm" />
        </video>

        {/* Heavy cinematic vignette — four-sided */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_20%,_black_80%)] pointer-events-none" />
        {/* Bottom-heavy gradient so text reads clearly */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none" />
        {/* Left edge darkening */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent pointer-events-none" />

        {/* Subtle color blooms */}
        <div className="absolute bottom-1/3 left-1/4 w-[40vw] h-[40vw] bg-blue-900/15 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
        <div className="absolute top-1/4 right-1/4 w-[30vw] h-[30vw] bg-blue-900/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
      </div>

      {/* ── CINEMATIC TEXT — fixed bottom-left ── */}
      <div className="relative z-10 flex flex-col gap-4 pb-24 pl-8 sm:pl-12 md:pl-20 max-w-4xl">

        {/* Stagger in each line from bottom */}
        <motion.div
          initial={{ opacity: 0, y: 60, filter: 'blur(12px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        >
          <span className="block text-[10px] sm:text-xs uppercase tracking-[0.35em] text-white/40 font-inter mb-3">
            &mdash;&nbsp; Software Engineer &mdash;
          </span>
          <h1 className="font-outfit font-black leading-[0.9] tracking-tighter text-white"
            style={{ fontSize: 'clamp(3.5rem, 10vw, 9rem)' }}>
            {data.bio.name.split(' ').map((word, i) => (
              <span key={i} className="block">{word}</span>
            ))}
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.7 }}
          className="flex items-center gap-3"
        >
          <div className="h-[1px] w-8 bg-white/30" />
          <RotatingText items={data.bio.designation} />
        </motion.div>

      </div>

      {/* ── SCROLL / ENTER hint when live ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: stage === 'home' ? 1 : 0 }}
        transition={{ delay: 2.5, duration: 1.2 }}
        className="absolute bottom-10 right-10 z-10 flex flex-col items-center gap-2 pointer-events-none"
      >
        <div className="w-[1px] h-10 bg-gradient-to-b from-white/40 to-transparent" />
        <span className="text-[9px] uppercase tracking-[0.3em] text-white/30 font-inter rotate-90 origin-top-right translate-y-12">
          2026
        </span>
      </motion.div>

    </section>
  );
}
