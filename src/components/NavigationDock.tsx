'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Home, User, GraduationCap, Briefcase, FileText, Mail } from 'lucide-react';
import { useAppContext } from './AppProvider';
import { useDeviceType } from '@/hooks/useDeviceType';

const DOCK_ITEMS = [
  { id: 'home',      icon: Home,          label: 'Home',      href: '/'          },
  { id: 'about',     icon: User,          label: 'About',     href: '/about'     },
  { id: 'education', icon: GraduationCap, label: 'Education', href: '/education' },
  { id: 'projects',  icon: Briefcase,     label: 'Projects',  href: '/projects'  },
  { id: 'resume',    icon: FileText,      label: 'Resume',    href: '/resume'    },
  { id: 'contact',   icon: Mail,          label: 'Contact',   href: '/contact'   },
];

export default function NavigationDock() {
  const mouseX      = useMotionValue(Infinity);
  const { stage }   = useAppContext();
  const pathname    = usePathname();
  const { isTouchDevice } = useDeviceType();

  // Don't show during lanyard / cinematic stages on the home page
  const isLocked  = pathname === '/' && (stage === 'preloading' || stage === 'lanyard' || stage === 'cinematic');
  const isVisible = !isLocked;

  // ─── Mobile / Tablet — floating pill tab bar (liquid-glass) ──────────────
  if (isTouchDevice) {
    return (
      <motion.nav
        aria-label="Navigation Dock"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: isVisible ? 0 : 100, opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] w-auto"
      >
        {/* Outer glow aura */}
        <div
          className="absolute inset-0 -z-10 rounded-[32px] pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 120%, rgba(59,130,246,0.10) 0%, transparent 70%)',
            filter: 'blur(10px)',
          }}
        />

        <div
          className="liquid-glass flex items-center gap-1 px-3 py-2 shadow-[0_-6px_24px_-8px_rgba(0,0,0,0.5)]"
          style={{ paddingBottom: 'max(8px, env(safe-area-inset-bottom, 8px))' }}
        >
          {DOCK_ITEMS.map((item) => (
            <MobileTabItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              href={item.href}
              isActive={pathname === item.href}
            />
          ))}
        </div>
      </motion.nav>
    );
  }

  // ─── Laptop / Desktop — original macOS-style magnifying dock ─────────────
  return (
    <motion.nav
      aria-label="Navigation Dock"
      initial={{ y: 120, opacity: 0 }}
      animate={{ y: isVisible ? 0 : 120, opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] px-6 py-4"
    >
      {/* Background Glow/Blur Aura for isolation */}
      <div
        className="absolute inset-0 -z-10 bg-black/20 backdrop-blur-2xl rounded-[32px] mask-gradient-to-t pointer-events-none"
        style={{ maskImage: 'linear-gradient(to top, black 40%, transparent)' }}
      />

      <div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="relative flex h-16 items-end gap-3 px-4 pb-3 liquid-glass isolate shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.3)]"
      >
        {DOCK_ITEMS.map((item) => (
          <DockIcon
            key={item.id}
            mouseX={mouseX}
            icon={item.icon}
            label={item.label}
            href={item.href}
            isActive={pathname === item.href}
          />
        ))}
      </div>
    </motion.nav>
  );
}

// ─── Mobile tab item — liquid-glass style ────────────────────────────────────
function MobileTabItem({
  icon: Icon,
  label,
  href,
  isActive,
}: {
  icon: any;
  label: string;
  href: string;
  isActive: boolean;
}) {
  return (
    <Link href={href} title={label} aria-label={label}
      className="flex items-center justify-center group"
    >
      <motion.div
        whileTap={{ scale: 0.80 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        className={`relative flex items-center justify-center w-9 h-9 rounded-full liquid-glass transition-colors duration-200 ${
          isActive ? 'bg-blue-500/20 border-blue-400/40' : 'active:bg-white/10'
        }`}
      >
        <Icon
          className={`w-4 h-4 transition-colors duration-200 ${
            isActive ? 'text-blue-400' : 'text-white/55'
          }`}
        />

        {/* Active glow dot */}
        {isActive && (
          <span className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-blue-400 shadow-[0_0_6px_#3b82f6]" />
        )}
      </motion.div>
    </Link>
  );
}

// ─── Laptop dock icon (unchanged) ────────────────────────────────────────────
function DockIcon({
  mouseX,
  icon: Icon,
  label,
  href,
  isActive,
}: {
  mouseX: any;
  icon: any;
  label: string;
  href: string;
  isActive: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-150, 0, 150], [40, 72, 40]);
  const width     = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <Link href={href}>
      <motion.div
        ref={ref}
        style={{ width }}
        className="group relative flex aspect-square items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-colors shadow-inner cursor-pointer focus:outline-none"
      >
        <Icon className="w-1/2 h-1/2 text-white/60 group-hover:text-white transition-colors" />

        {/* Tooltip */}
        <span className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap px-3 py-1.5 liquid-glass text-xs font-inter font-medium tracking-wide pointer-events-none">
          {label}
        </span>

        {/* Active dot */}
        <span className={`absolute -bottom-1.5 w-1 h-1 rounded-full transition-all ${
          isActive
            ? 'bg-blue-400 shadow-[0_0_8px_#3b82f6]'
            : 'bg-white/30 group-hover:bg-blue-400 group-hover:shadow-[0_0_8px_#3b82f6]'
        }`} />
      </motion.div>
    </Link>
  );
}
