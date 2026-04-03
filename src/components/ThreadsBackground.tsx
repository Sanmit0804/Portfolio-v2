'use client';

/**
 * ThreadsBackground
 * A thin wrapper around the React Bits Threads component configured as an
 * unobtrusive full-screen background layer.
 *
 * Props:
 *  - delay     : ms before the background starts fading in (default 600)
 *  - duration  : fade-in transition duration in ms (default 1200)
 *  - color     : [0.23, 0.51, 0.96] – matches blue-500 (#3b82f6)
 *  - amplitude : 1.2 – slightly more expressive than default
 *  - distance  : 0   – threads don't spread wide, stays elegant
 *  - enableMouseInteraction : true – threads respond to cursor
 */

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const Threads = dynamic(() => import('@/components/Threads'), {
  ssr: false,
});

interface ThreadsBackgroundProps {
  /** Delay in ms before the animation starts appearing. Default: 600 */
  delay?: number;
  /** Fade-in transition duration in ms. Default: 1200 */
  duration?: number;
}

export default function ThreadsBackground({
  delay = 600,
  duration = 1200,
}: ThreadsBackgroundProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
      style={{
        opacity: visible ? 1 : 0,
        transition: `opacity ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
        willChange: 'opacity',
      }}
    >
      <Threads
        color={[0.23, 0.51, 0.96]}
        amplitude={1.2}
        distance={0}
        enableMouseInteraction={true}
      />
    </div>
  );
}
