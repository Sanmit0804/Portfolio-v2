'use client';

import { useEffect, useRef } from 'react';
import { useAppContext } from '@/components/AppProvider';
import { useDeviceType } from '@/hooks/useDeviceType';
import EntryLanyard from '@/components/EntryLanyard';
import Hero from '@/components/Hero';
import gsap from 'gsap';

export default function Home() {
  const { stage, setStage } = useAppContext();
  const { isTouchDevice } = useDeviceType();
  const mainRef = useRef<HTMLDivElement>(null);

  // Preloading — advance to lanyard stage (only for non-touch devices)
  useEffect(() => {
    if (stage === 'preloading' && !isTouchDevice) {
      const timer = setTimeout(() => setStage('lanyard'), 1500);
      return () => clearTimeout(timer);
    }
  }, [stage, setStage, isTouchDevice]);

  // Cinematic GSAP reveal after lanyard drag (only for non-touch devices)
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

  // Touch devices skip straight to home — Hero is immediately fully visible
  const lanyardPending = !isTouchDevice && (stage === 'preloading' || stage === 'lanyard');

  return (
    <main className="relative w-full h-screen overflow-hidden bg-black">
      {/* Hero is always mounted to preload the video */}
      <div
        ref={mainRef}
        style={{
          opacity: lanyardPending ? 0 : 1,
          transform: lanyardPending ? 'scale(1.15) translateY(4vh)' : 'scale(1) translateY(0)',
          filter: lanyardPending ? 'blur(24px)' : 'none',
          transition: 'none', // GSAP controls transitions, not CSS
          willChange: 'transform, opacity, filter',
        }}
        className="w-full h-full"
      >
        <Hero />
      </div>

      {/* Lanyard overlay — only rendered for non-touch devices */}
      {!isTouchDevice && <EntryLanyard />}
    </main>
  );
}
