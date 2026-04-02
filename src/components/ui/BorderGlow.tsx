'use client';

import React, { useEffect } from 'react';

const STYLE_ID = 'border-glow-keyframes';

const css = `
@keyframes border-glow-spin {
  0%   { --border-glow-angle: 0deg; }
  100% { --border-glow-angle: 360deg; }
}

@property --border-glow-angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}

.border-glow-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 22px;
  border-radius: 9999px;
  font-family: 'Outfit', sans-serif;
  font-size: 0.82rem;
  font-weight: 500;
  letter-spacing: 0.03em;
  color: rgba(255,255,255,0.85);
  background: rgba(255,255,255,0.04);
  cursor: pointer;
  text-decoration: none;
  white-space: nowrap;
  animation: border-glow-spin 3s linear infinite;
  border: 1.5px solid transparent;
  background-clip: padding-box;
  transition: color 0.3s ease, background 0.3s ease;
  z-index: 0;
}

.border-glow-btn::before {
  content: '';
  position: absolute;
  inset: -1.5px;
  border-radius: 9999px;
  padding: 1.5px;
  background: conic-gradient(
    from var(--border-glow-angle),
    transparent 0%,
    rgba(59, 130, 246, 0.9) 15%,
    rgba(147, 197, 253, 1) 30%,
    rgba(59, 130, 246, 0.9) 45%,
    transparent 60%,
    transparent 100%
  );
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
          mask-composite: exclude;
  pointer-events: none;
  z-index: -1;
}

.border-glow-btn:hover {
  color: #fff;
  background: rgba(59, 130, 246, 0.12);
}
`;

interface BorderGlowProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export default function BorderGlow({ href, children, className = '' }: BorderGlowProps) {
  useEffect(() => {
    if (!document.getElementById(STYLE_ID)) {
      const style = document.createElement('style');
      style.id = STYLE_ID;
      style.textContent = css;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`border-glow-btn ${className}`}
    >
      {children}
    </a>
  );
}
