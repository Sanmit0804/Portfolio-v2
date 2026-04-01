import React, { useState } from 'react';

export interface LogoWallProps {
  items: React.ReactNode[];
  direction?: 'horizontal' | 'vertical';
  pauseOnHover?: boolean;
  size?: string;
  duration?: string;
  textColor?: string;
  bgColor?: string;
  bgClass?: string;
}

export default function LogoWall({
  items = [],
  direction = 'horizontal',
  pauseOnHover = false,
  size = '10rem',
  duration = '60s',
  textColor = '#ffffff',
  bgColor = 'transparent',
  bgClass = '',
}: LogoWallProps) {
  const [isPaused, setIsPaused] = useState(false);
  const isVertical = direction === 'vertical';

  return (
    <div
      className={`relative flex overflow-hidden select-none w-full ${isVertical ? 'flex-col h-full' : 'flex-row h-full'} ${bgClass}`}
      style={{
        backgroundColor: bgColor,
        color: textColor,
        WebkitMaskImage: isVertical
          ? 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)'
          : 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
        maskImage: isVertical
          ? 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)'
          : 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
        ['--size' as string]: size,
        ['--duration' as string]: duration,
      }}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      <style>{`
        @keyframes marquee-x {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        @keyframes marquee-y {
          0% { transform: translateY(0); }
          100% { transform: translateY(-100%); }
        }
      `}</style>
      {[0, 1].map((i) => (
        <div
          key={i}
          className={`flex shrink-0 ${isVertical ? 'flex-col min-h-full' : 'flex-row min-w-full'}`}
          style={{
            animation: `${isVertical ? 'marquee-y' : 'marquee-x'} var(--duration) linear infinite`,
            animationPlayState: isPaused ? 'paused' : 'running',
          }}
          aria-hidden={i === 1 ? 'true' : undefined}
        >
          {items.map((item, idx) => (
            <div
              key={idx}
              className="flex justify-center items-center px-4"
              style={{
                width: !isVertical && size !== 'auto' ? size : undefined,
                height: isVertical && size !== 'auto' ? size : undefined,
              }}
            >
              {item}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
