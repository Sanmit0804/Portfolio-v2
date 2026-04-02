'use client';

/**
 * ThreadsBackground
 * A thin wrapper around the React Bits Threads component configured as an
 * unobtrusive full-screen background layer.
 *
 * Props forwarded to Threads:
 *  - color     : [0.23, 0.51, 0.96] – matches blue-500 (#3b82f6)
 *  - amplitude : 1.2 – slightly more expressive than default
 *  - distance  : 0   – threads don't spread wide, stays elegant
 *  - enableMouseInteraction : true – threads respond to cursor
 */

import dynamic from 'next/dynamic';

const Threads = dynamic(() => import('@/components/Threads'), {
  ssr: false,
});

export default function ThreadsBackground() {
  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
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
