'use client';

import { useEffect, useState } from 'react';

export type DeviceType = 'mobile' | 'tablet' | 'laptop' | 'desktop';

/**
 * Detects the device category using screen width thresholds and the
 * `pointer: coarse` media query (touch screens).
 *
 * Breakpoints:
 *   mobile  — width < 768 px
 *   tablet  — 768 px ≤ width < 1280 px  AND coarse pointer (touch)
 *   laptop  — 768 px ≤ width < 1280 px  AND fine pointer (mouse/trackpad)
 *   desktop — width ≥ 1280 px
 *
 * Returns:
 *   deviceType    — one of the four categories above (null before mount)
 *   isTouchDevice — true for mobile & tablet (skips lanyard)
 *
 * IMPORTANT: Initial value is `null` so that the server render and the
 * client's first render produce identical output, preventing hydration
 * mismatches. Detection only runs inside useEffect (after mount).
 */
export function useDeviceType() {
  // `null` = "not yet detected" — matches what SSR produces (no window access)
  const [deviceType, setDeviceType] = useState<DeviceType | null>(null);

  useEffect(() => {
    // Run once on mount, then again whenever the viewport is resized
    const update = () => setDeviceType(detect());
    update();

    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Before mount (SSR / first client render): treat as non-touch so the
  // initial HTML matches the server-rendered HTML.
  const isTouchDevice =
    deviceType === 'mobile' || deviceType === 'tablet';

  return { deviceType, isTouchDevice };
}

// ---------------------------------------------------------------------------
// Internal helper — runs only in the browser (never called during SSR)
// ---------------------------------------------------------------------------
function detect(): DeviceType {
  const w = window.innerWidth;
  const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;

  if (w < 768) return 'mobile';
  if (w < 1280) return isCoarsePointer ? 'tablet' : 'laptop';
  return 'desktop';
}
