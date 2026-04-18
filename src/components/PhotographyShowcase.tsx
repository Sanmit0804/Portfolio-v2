'use client';

import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import Image from 'next/image';

const IMAGES = Array.from({ length: 23 }, (_, i) => `/images/${i + 1}.webp`);

export default function PhotographyShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const scrollRange = useMotionValue(0);

  useEffect(() => {
    const updateRange = () => {
      if (trackRef.current) {
        scrollRange.set(trackRef.current.scrollWidth - window.innerWidth);
      }
    };
    updateRange();

    // Add small delay to ensure images calculate width
    const timeout = setTimeout(updateRange, 500);

    window.addEventListener('resize', updateRange);
    return () => {
      window.removeEventListener('resize', updateRange);
      clearTimeout(timeout);
    };
  }, [scrollRange]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const springProgress = useSpring(scrollYProgress, { stiffness: 50, damping: 20 });

  // Dynamically uses the latest motion value without breaking react boundaries
  const x = useTransform(springProgress, (v) => -v * scrollRange.get());

  return (
    <section ref={containerRef} className="relative h-[350vh] w-full bg-[#050505]">
      {/* Background */}
      <div className="sticky top-0 h-screen w-full flex items-center overflow-hidden bg-[#000]">

        {/* User Photo Background */}
        <motion.div
          className="absolute inset-0 w-full h-full z-10 pointer-events-none"
          style={{
            opacity: useTransform(springProgress, [0, 0.1], [1, 0]),
            scale: useTransform(springProgress, [0, 0.1], [1, 1.05]),
          }}
        >
          {/* Gradients to blend the image seamlessly into the black void */}
          <div className="absolute inset-0 z-20 bg-gradient-to-r from-black via-black/70 md:via-black/30 to-transparent" />
          <div className="absolute inset-0 z-20 bg-gradient-to-t from-black via-transparent to-black/60" />

          <div className="absolute right-0 top-0 bottom-0 w-full md:w-3/4 h-full z-10">
            <Image
              src="/me.jpg"
              alt="Me capturing photos"
              fill
              className="object-cover object-center md:object-[right_top] opacity-50 md:opacity-70 grayscale contrast-125"
              priority
            />
          </div>
        </motion.div>

        {/* Intro text */}
        <motion.div
          className="absolute left-6 md:left-24 top-1/4 md:top-1/2 -translate-y-1/2 z-30 mix-blend-difference text-white pointer-events-none"
          style={{
            opacity: useTransform(springProgress, [0, 0.1], [1, 0]),
            x: useTransform(springProgress, [0, 0.1], [0, -100])
          }}
        >
          <h3 className="text-5xl sm:text-6xl md:text-8xl lg:text-[10rem] font-light tracking-tighter uppercase leading-[0.85] font-outfit">
            Through <br /><span className="font-black italic text-blue-500">The Lens</span>
          </h3>

          <p className="mt-6 md:mt-8 text-sm sm:text-base md:text-xl font-light text-white/80 max-w-[280px] sm:max-w-sm md:max-w-md tracking-wide leading-relaxed">
            Beyond screens and code, I explore the world through my lens—capturing raw moments, light, and perspective that words often fail to express.
          </p>
        </motion.div>

        {/* The scrolling track */}
        <motion.div
          ref={trackRef}
          style={{ x, willChange: "transform" }}
          className="flex items-center gap-4 sm:gap-8 md:gap-16 pl-[100vw] pr-[5vw] md:pr-[10vw] h-full w-max"
        >
          {IMAGES.map((src, idx) => {
            const isEven = idx % 2 === 0;
            const isLarge = (idx + 1) % 4 === 0;

            // Dynamic sizing based on pattern
            let widthClass = "w-[65vw] sm:w-[50vw] md:w-[30vw]";
            let heightClass = "h-[45vh] sm:h-[50vh] md:h-[55vh]";
            let yOffset = isEven ? "-translate-y-8 md:-translate-y-16" : "translate-y-8 md:translate-y-16";

            if (isLarge) {
              widthClass = "w-[80vw] sm:w-[65vw] md:w-[45vw]";
              heightClass = "h-[55vh] sm:h-[60vh] md:h-[75vh]";
              yOffset = "translate-y-0";
            }

            return (
              <motion.div
                key={idx}
                className={`relative flex-shrink-0 group rounded-lg overflow-hidden ${widthClass} ${heightClass} ${yOffset} shadow-2xl shadow-blue-500/5`}
                whileHover={{ scale: 0.98 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <Image
                  src={src}
                  alt={`Photography ${idx + 1}`}
                  fill
                  sizes="(max-width: 768px) 85vw, (max-width: 1200px) 50vw, 45vw"
                  className="object-cover scale-[1.05] group-hover:scale-110 group-hover:saturate-150 transition-all duration-[1.5s] ease-out will-change-transform"
                  priority={idx < 4}
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-700 mix-blend-overlay" />

                {/* Number indicator */}
                <div className="absolute bottom-4 left-4 font-outfit text-white/50 text-xs font-light tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  NO. {(idx + 1).toString().padStart(2, '0')}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Progress bar line at the bottom */}
        <div className="absolute bottom-10 left-10 md:left-24 right-10 md:right-24 h-[1px] bg-white/10 overflow-hidden">
          <motion.div
            className="h-full bg-blue-500 origin-left"
            style={{ scaleX: springProgress }}
          />
        </div>
      </div>
    </section>
  );
}
