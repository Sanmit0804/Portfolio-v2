'use client';

/**
 * AntigravityBackground
 * A thin wrapper around the React Bits Antigravity component configured as an
 * unobtrusive full-screen background layer.
 *
 * Key tuning vs defaults:
 *  - particleSize  : 0.4  (default 2)   – very small particles
 *  - lerpSpeed     : 0.03 (default 0.1) – slower, dreamier follow
 *  - count         : 120  (default 300) – lighter on GPU
 *  - color         : matches the site's blue accent
 *  - autoAnimate   : true – gently animates even without mouse movement
 */

import dynamic from 'next/dynamic';

const Antigravity = dynamic(() => import('@/components/Antigravity'), {
  ssr: false,
});

export default function AntigravityBackground() {
  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    >
      <Antigravity
        count={120}
        particleSize={0.4}
        lerpSpeed={0.03}
        color="#3b82f6"
        magnetRadius={12}
        ringRadius={8}
        waveSpeed={0.3}
        waveAmplitude={0.8}
        autoAnimate={true}
        particleVariance={0.6}
        pulseSpeed={2}
        fieldStrength={12}
      />
    </div>
  );
}
