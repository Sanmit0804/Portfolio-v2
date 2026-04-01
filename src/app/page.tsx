'use client';

import { useEffect, useRef } from 'react';
import { useAppContext } from '@/components/AppProvider';
import EntryLanyard from '@/components/EntryLanyard';
import Hero from '@/components/Hero';
import gsap from 'gsap';

export default function Home() {
  const { stage, setStage } = useAppContext();
  const mainRef = useRef<HTMLDivElement>(null);

  // Preloading — advance to lanyard stage
  useEffect(() => {
    if (stage === 'preloading') {
      const timer = setTimeout(() => setStage('lanyard'), 1500);
      return () => clearTimeout(timer);
    }
  }, [stage, setStage]);

  // Cinematic GSAP reveal after lanyard drag
  useEffect(() => {
    if (stage === 'cinematic' && mainRef.current) {
      gsap.fromTo(
        mainRef.current,
        { scale: 1.15, opacity: 0, filter: 'blur(24px)', y: '4vh' },
        {
          delay: 1.5,
          scale: 1, 
          opacity: 1, 
          filter: 'blur(0px)',
          y: '0vh',
          duration: 2.8, 
          ease: 'expo.inOut',
          onComplete: () => setStage('home'),
        }
      );
    }
  }, [stage, setStage]);

  return (
    <main className="relative w-full h-screen overflow-hidden bg-black">
      {/* Hero is always mounted to preload the video */}
      <div
        ref={mainRef}
        style={{
          // Visually hidden during lanyard stage but still renders for preloading
          opacity: (stage === 'preloading' || stage === 'lanyard') ? 0 : 1,
          transform: (stage === 'preloading' || stage === 'lanyard') ? 'scale(1.15) translateY(4vh)' : 'scale(1) translateY(0)',
          filter: (stage === 'preloading' || stage === 'lanyard') ? 'blur(24px)' : 'none',
          transition: 'none', // GSAP controls this, not CSS
          willChange: 'transform, opacity, filter',
        }}
        className="w-full h-full"
      >
        <Hero />
      </div>

      {/* Lanyard overlay */}
      <EntryLanyard />
    </main>
  );
}
