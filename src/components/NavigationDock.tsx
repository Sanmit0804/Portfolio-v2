'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Home, User, GraduationCap, Briefcase, FileText, Mail } from 'lucide-react';
import { useAppContext } from './AppProvider';

const DOCK_ITEMS = [
  { id: 'home', icon: Home, label: 'Home', href: '/' },
  { id: 'about', icon: User, label: 'About Me', href: '/about' },
  { id: 'education', icon: GraduationCap, label: 'Education', href: '/education' },
  { id: 'projects', icon: Briefcase, label: 'Projects', href: '/projects' },
  { id: 'resume', icon: FileText, label: 'Resume', href: '/resume' },
  { id: 'contact', icon: Mail, label: 'Contact Me', href: '/contact' },
];

export default function NavigationDock() {
  const mouseX = useMotionValue(Infinity);
  const { stage } = useAppContext();
  const pathname = usePathname();

  // Don't show dock during lanyard / cinematic stages on the home page
  const isLocked = pathname === '/' && (stage === 'preloading' || stage === 'lanyard' || stage === 'cinematic');
  const isVisible = !isLocked;

  return (
    <motion.nav
      aria-label="Navigation Dock"
      initial={{ y: 120, opacity: 0 }}
      animate={{ y: isVisible ? 0 : 120, opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] px-6 py-4"
    >
      {/* Background Glow/Blur Aura for isolation */}
      <div className="absolute inset-0 -z-10 bg-black/20 backdrop-blur-2xl rounded-[32px] mask-gradient-to-t pointer-events-none" 
           style={{ maskImage: 'linear-gradient(to top, black 40%, transparent)' }} />
      
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
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

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
